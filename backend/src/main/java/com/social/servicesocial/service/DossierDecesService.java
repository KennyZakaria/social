package com.social.servicesocial.service;

import com.social.servicesocial.dto.DossierDecesRequest;
import com.social.servicesocial.dto.DossierDecesResponse;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.model.DossierDeces;
import com.social.servicesocial.model.StatutDossierDeces;
import com.social.servicesocial.repository.AdherentRepository;
import com.social.servicesocial.repository.DossierDecesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DossierDecesService {

    private final DossierDecesRepository dossierDecesRepository;
    private final AdherentRepository adherentRepository;

    // ── Create ───────────────────────────────────────────────────────────
    @Transactional
    public DossierDecesResponse create(DossierDecesRequest req) {
        if (req.getAdherentId() == null)
            throw new IllegalArgumentException("L'adhérent est obligatoire.");
        if (req.getDateDeces() == null)
            throw new IllegalArgumentException("La date du décès est obligatoire.");
        if (req.getLieuDeces() == null || req.getLieuDeces().isBlank())
            throw new IllegalArgumentException("Le lieu du décès est obligatoire.");

        Adherent adherent = adherentRepository.findById(req.getAdherentId())
                .orElseThrow(() -> new NotFoundException("Adhérent introuvable : " + req.getAdherentId()));

        if (dossierDecesRepository.existsByAdherentId(req.getAdherentId()))
            throw new IllegalArgumentException("Un dossier de décès existe déjà pour cet adhérent.");

        String nomComplet = adherent.getNomAr() + " " + adherent.getPrenomAr();

        DossierDeces dossier = DossierDeces.builder()
                .numero(generateNumero())
                .adherentId(adherent.getId())
                .nomComplet(nomComplet)
                .dateDeces(req.getDateDeces())
                .lieuDeces(req.getLieuDeces().trim())
                .natureDeces(req.getNatureDeces())
                .causeDeces(req.getCauseDeces())
                .dpr(req.getDpr())
                .observation(req.getObservation())
                .statut(StatutDossierDeces.EN_COURS)
                .build();

        return toResponse(dossierDecesRepository.save(dossier));
    }

    // ── Get all ──────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<DossierDecesResponse> findAll() {
        return dossierDecesRepository.findAll().stream().map(this::toResponse).toList();
    }

    // ── Get by id ────────────────────────────────────────────────────────
    @Transactional(readOnly = true)
    public DossierDecesResponse findById(Long id) {
        return toResponse(dossierDecesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dossier décès introuvable : " + id)));
    }

    // ── Update statut ────────────────────────────────────────────────────
    @Transactional
    public DossierDecesResponse updateStatut(Long id, String statut) {
        DossierDeces dossier = dossierDecesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dossier décès introuvable : " + id));
        dossier.setStatut(StatutDossierDeces.valueOf(statut.toUpperCase()));
        return toResponse(dossierDecesRepository.save(dossier));
    }

    // ── Delete ───────────────────────────────────────────────────────────
    @Transactional
    public void delete(Long id) {
        if (!dossierDecesRepository.existsById(id))
            throw new NotFoundException("Dossier décès introuvable : " + id);
        dossierDecesRepository.deleteById(id);
    }

    // ── Helpers ──────────────────────────────────────────────────────────
    private String generateNumero() {
        int year = Year.now().getValue();
        long count = dossierDecesRepository.count() + 1;
        String numero;
        do {
            numero = String.format("DEC-%d-%05d", year, count++);
        } while (dossierDecesRepository.existsByNumero(numero));
        return numero;
    }

    private DossierDecesResponse toResponse(DossierDeces d) {
        String matricule = adherentRepository.findById(d.getAdherentId())
                .map(Adherent::getMatricule).orElse(null);
        return DossierDecesResponse.builder()
                .id(d.getId())
                .numero(d.getNumero())
                .adherentId(d.getAdherentId())
                .nomComplet(d.getNomComplet())
                .matricule(matricule)
                .dateDeces(d.getDateDeces())
                .lieuDeces(d.getLieuDeces())
                .natureDeces(d.getNatureDeces())
                .causeDeces(d.getCauseDeces())
                .dpr(d.getDpr())
                .observation(d.getObservation())
                .statut(d.getStatut() != null ? d.getStatut().name() : null)
                .build();
    }
}
