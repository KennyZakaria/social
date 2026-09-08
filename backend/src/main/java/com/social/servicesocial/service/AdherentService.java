package com.social.servicesocial.service;

import com.social.servicesocial.dto.*;
import com.social.servicesocial.exception.ConflictException;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.repository.AdherentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AdherentService {

    private static final String EN_ACTIVITE = "EN_ACTIVITE";
    private static final String RETRAITE = "RETRAITE";
    private static final String SOUS_OFFICIERS = "SOUS_OFFICIERS";
    private static final String OFFICIERS = "OFFICIERS";
    private static final String OFFICIERS_SUPERIEURS = "OFFICIERS_SUPERIEURS";
    private static final String OFFICIERS_GENERAUX = "OFFICIERS_GENERAUX";

    private final AdherentRepository repository;

    // ── List / search ────────────────────────────────────────────────────
    public AdherentPageResponse list(String search, String categorie, String situation, Pageable pageable) {

        Specification<Adherent> spec = (r, q, c) -> c.conjunction();

        if (search != null && !search.isBlank()) {
            String v = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((r, q, c) -> c.or(
                    c.like(c.lower(r.get("nomAr")), v),
                    c.like(c.lower(r.get("prenomAr")), v),
                    c.like(c.lower(r.get("matricule")), v),
                    c.like(c.lower(r.get("matriculeBR")), v),
                    c.like(c.lower(r.get("cin")), v)
            ));
        }

        if (categorie != null && !categorie.isBlank()) {
            String v = "%" + categorie.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((r, q, c) -> c.like(c.lower(r.get("categorie")), v));
        }

        if (situation != null && !situation.isBlank()) {
            String v = "%" + situation.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((r, q, c) -> c.like(c.lower(r.get("situationCategorie")), v));
        }

        Page<Adherent> page = repository.findAll(spec, pageable);

        return new AdherentPageResponse(
                page.getContent().stream().map(this::toResponse).toList(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        );
    }

    // ── Statistics ───────────────────────────────────────────────────────
    public AdherentStatistics statistics() {
        List<Adherent> all = repository.findAll();
        long total      = all.size();
        long actifs     = all.stream().filter(a -> EN_ACTIVITE.equals(a.getSituationCategorie())).count();
        long retraites  = all.stream().filter(a -> RETRAITE.equals(a.getSituationCategorie())).count();
        long pensionnes = all.stream().filter(adherent -> adherent.isPension()).count();
        return new AdherentStatistics(total, actifs, retraites, pensionnes);
    }

    // ── Get by id ────────────────────────────────────────────────────────
    public AdherentResponse get(Long id) {
        return toResponse(required(id));
    }

    // ── Create ───────────────────────────────────────────────────────────
    @Transactional
    public AdherentResponse create(AdherentRequest req) {
        validateUnique(req, null);
        return toResponse(repository.save(fromRequest(new Adherent(), req)));
    }

    // ── Update ───────────────────────────────────────────────────────────
    @Transactional
    public AdherentResponse update(Long id, AdherentRequest req) {
        Adherent a = required(id);
        validateUnique(req, id);
        return toResponse(repository.save(fromRequest(a, req)));
    }

    // ── Delete ───────────────────────────────────────────────────────────
    @Transactional
    public void delete(Long id) {
        repository.delete(required(id));
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    private Adherent required(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Adhérent introuvable : " + id));
    }

    private void validateUnique(AdherentRequest req, Long id) {
        Long ignored = id == null ? -1L : id;
        if (repository.existsByMatriculeAndIdNot(req.matricule(), ignored))
            throw new ConflictException("Matricule déjà utilisé");
        if (repository.existsByCinAndIdNot(req.cin(), ignored))
            throw new ConflictException("CIN déjà utilisé");
    }

    private Adherent fromRequest(Adherent a, AdherentRequest r) {
        a.setPrenomAr(r.prenomAr());
        a.setNomAr(r.nomAr());
        a.setCategorie(normalizeCategorie(r.categorie()));
        a.setGrade(r.grade());
        a.setMatriculeBR(r.matriculeBR());
        a.setMatricule(r.matricule());
        a.setDateNaissance(r.dateNaissance());
        a.setLieuNaissance(r.lieuNaissance());
        a.setDateRadiation(r.dateRadiation());
        a.setMotifRadiation(r.motifRadiation());
        a.setDateDeces(r.dateDeces());
        a.setCauseDeces(r.causeDeces());
        a.setDernierUnite(r.dernierUnite());
        a.setFormationUnite(r.formationUnite());
        a.setTelephone1(r.telephone1());
        a.setTelephone2(r.telephone2());
        a.setAdresse(r.adresse());
        a.setEmail(r.email());
        String situation = normalizeSituation(r.situationCategorie());
        a.setSituationCategorie(situation);
        a.setPension(RETRAITE.equals(situation));
        a.setCin(r.cin());
        return a;
    }

    private String normalizeCategorie(String categorie) {
        if (categorie == null || categorie.isBlank()) {
            throw new IllegalArgumentException("La catégorie est obligatoire.");
        }
        String value = categorie.trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_').replace('É', 'E');
        return switch (value) {
            case "SOUS_OFFICIERS", "SOUS_OFFICIER" -> SOUS_OFFICIERS;
            case "OFFICIERS", "OFFICIER" -> OFFICIERS;
            case "OFFICIERS_SUPERIEURS", "OFFICIER_SUPERIEUR" -> OFFICIERS_SUPERIEURS;
            case "OFFICIERS_GENERAUX", "OFFICIER_GENERAL" -> OFFICIERS_GENERAUX;
            default -> throw new IllegalArgumentException("La catégorie sélectionnée est invalide.");
        };
    }
    private String normalizeSituation(String situation) {
        if (situation == null || situation.isBlank()) {
            throw new IllegalArgumentException("La situation catégorie est obligatoire.");
        }
        String value = situation.trim().toUpperCase(Locale.ROOT).replace('-', '_').replace(' ', '_');
        return switch (value) {
            case "EN_ACTIVITE", "ACTIF", "ACTIVE", "ACTIVITE" -> EN_ACTIVITE;
            case "RETRAITE", "RETRAITEE" -> RETRAITE;
            default -> throw new IllegalArgumentException("La situation catégorie doit être EN_ACTIVITE ou RETRAITE.");
        };
    }
    private AdherentResponse toResponse(Adherent a) {
        return new AdherentResponse(
                a.getId(), a.getPrenomAr(), a.getNomAr(), a.getCategorie(), a.getGrade(),
                a.getMatriculeBR(), a.getMatricule(), a.getDateNaissance(), a.getLieuNaissance(),
                a.getDateRadiation(), a.getMotifRadiation(), a.getDateDeces(), a.getCauseDeces(),
                a.getDernierUnite(), a.getFormationUnite(), a.getTelephone1(), a.getTelephone2(),
                a.getAdresse(), a.getEmail(), a.getSituationCategorie(), a.isPension(), a.getCin()
        );
    }
}
