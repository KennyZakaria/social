package com.social.servicesocial.service;

import com.social.servicesocial.dto.DossierRequest;
import com.social.servicesocial.dto.DossierResponse;
import com.social.servicesocial.exception.ConflictException;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.Dossier;
import com.social.servicesocial.model.DossierStatut;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.repository.DossierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class DossierService {

    private final DossierRepository repository;

    // ── List ─────────────────────────────────────────────────────────────
    public Page<DossierResponse> list(SocialModule section, String search, DossierStatut statut, Pageable pageable) {
        Specification<Dossier> spec = (r, q, c) -> c.equal(r.get("section"), section);

        if (search != null && !search.isBlank()) {
            String v = "%" + search.toLowerCase(Locale.ROOT).trim() + "%";
            spec = spec.and((r, q, c) -> c.or(
                    c.like(c.lower(r.get("numero")), v),
                    c.like(c.lower(r.get("adherentNom")), v),
                    c.like(c.lower(r.get("matricule")), v)
            ));
        }

        if (statut != null) {
            spec = spec.and((r, q, c) -> c.equal(r.get("statut"), statut));
        }

        return repository.findAll(spec, pageable).map(this::toResponse);
    }

    // ── Get by id ────────────────────────────────────────────────────────
    public DossierResponse get(SocialModule section, Long id) {
        return toResponse(requiredInSection(section, id));
    }

    // ── Create ───────────────────────────────────────────────────────────
    @Transactional
    public DossierResponse create(SocialModule section, DossierRequest r) {
        validateUniqueNumero(r.numero(), null);
        Dossier d = Dossier.builder()
                .section(section)
                .numero(r.numero())
                .adherentNom(r.adherentNom())
                .matricule(r.matricule())
                .dateEvenement(r.dateEvenement())
                .lieu(r.lieu())
                .nature(r.nature())
                .description(r.description())
                .statut(r.statut())
                .build();
        return toResponse(repository.save(d));
    }

    // ── Update ───────────────────────────────────────────────────────────
    @Transactional
    public DossierResponse update(SocialModule section, Long id, DossierRequest r) {
        Dossier d = requiredInSection(section, id);
        validateUniqueNumero(r.numero(), id);
        d.setNumero(r.numero());
        d.setAdherentNom(r.adherentNom());
        d.setMatricule(r.matricule());
        d.setDateEvenement(r.dateEvenement());
        d.setLieu(r.lieu());
        d.setNature(r.nature());
        d.setDescription(r.description());
        d.setStatut(r.statut());
        return toResponse(repository.save(d));
    }

    // ── Delete ───────────────────────────────────────────────────────────
    @Transactional
    public void delete(SocialModule section, Long id) {
        repository.delete(requiredInSection(section, id));
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    private Dossier requiredInSection(SocialModule section, Long id) {
        Dossier d = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dossier introuvable : " + id));
        if (d.getSection() != section)
            throw new NotFoundException("Dossier introuvable : " + id);
        return d;
    }

    private void validateUniqueNumero(String numero, Long id) {
        Long x = id == null ? -1L : id;
        if (repository.existsByNumeroAndIdNot(numero, x))
            throw new ConflictException("Numéro de dossier déjà utilisé");
    }

    private DossierResponse toResponse(Dossier d) {
        return new DossierResponse(
                d.getId(), d.getSection(), d.getNumero(), d.getAdherentNom(), d.getMatricule(),
                d.getDateEvenement(), d.getLieu(), d.getNature(), d.getDescription(),
                d.getStatut(), d.getDateCreation(), d.getDateMaj()
        );
    }
}
