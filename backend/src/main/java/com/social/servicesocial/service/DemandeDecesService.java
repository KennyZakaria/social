package com.social.servicesocial.service;

import com.social.servicesocial.dto.DemandeDecesRequest;
import com.social.servicesocial.dto.DemandeDecesResponse;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.DemandeDeces;
import com.social.servicesocial.model.DossierDeces;
import com.social.servicesocial.model.StatutDemande;
import com.social.servicesocial.repository.DemandeDecesRepository;
import com.social.servicesocial.repository.DossierDecesRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DemandeDecesService {
    private final DemandeDecesRepository demandeRepository;
    private final DossierDecesRepository dossierRepository;

    @Transactional(readOnly = true)
    public List<DemandeDecesResponse> list(Long dossierId) {
        requireDossier(dossierId);
        return demandeRepository.findByDossierIdOrderByDateDemandeDesc(dossierId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public DemandeDecesResponse create(Long dossierId, DemandeDecesRequest request) {
        if (request.typeDemande() == null || request.typeDemande().isBlank()) throw new IllegalArgumentException("Le type de demande est obligatoire.");
        DossierDeces dossier = requireDossier(dossierId);
        DemandeDeces demande = DemandeDeces.builder().dossier(dossier).typeDemande(request.typeDemande().trim())
                .description(blankToNull(request.description())).statut(StatutDemande.EN_ATTENTE).dateDemande(LocalDateTime.now()).build();
        return toResponse(demandeRepository.save(demande));
    }

    @Transactional
    public DemandeDecesResponse updateStatut(Long dossierId, Long id, String statut) {
        requireDossier(dossierId);
        DemandeDeces demande = demandeRepository.findById(id).filter(item -> item.getDossier().getId().equals(dossierId))
                .orElseThrow(() -> new NotFoundException("Demande introuvable : " + id));
        demande.setStatut(StatutDemande.valueOf(statut.toUpperCase()));
        if (demande.getStatut() == StatutDemande.ACCEPTEE || demande.getStatut() == StatutDemande.REFUSEE || demande.getStatut() == StatutDemande.CLOTUREE) demande.setDateTraitement(LocalDateTime.now());
        return toResponse(demandeRepository.save(demande));
    }

    @Transactional
    public void delete(Long dossierId, Long id) {
        requireDossier(dossierId);
        DemandeDeces demande = demandeRepository.findById(id).filter(item -> item.getDossier().getId().equals(dossierId))
                .orElseThrow(() -> new NotFoundException("Demande introuvable : " + id));
        demandeRepository.delete(demande);
    }
    private DossierDeces requireDossier(Long id) { return dossierRepository.findById(id).orElseThrow(() -> new NotFoundException("Dossier décès introuvable : " + id)); }
    private String blankToNull(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private DemandeDecesResponse toResponse(DemandeDeces item) { return new DemandeDecesResponse(item.getId(), item.getDossier().getId(), item.getTypeDemande(), item.getDescription(), item.getStatut().name(), item.getDateDemande(), item.getDateTraitement()); }
}