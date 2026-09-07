package com.social.servicesocial.service;

import com.social.servicesocial.dto.AyantDroitRequest;
import com.social.servicesocial.dto.AyantDroitResponse;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.AyantDroit;
import com.social.servicesocial.model.DossierDeces;
import com.social.servicesocial.repository.AyantDroitRepository;
import com.social.servicesocial.repository.DossierDecesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AyantDroitService {

    private final AyantDroitRepository ayantDroitRepository;
    private final DossierDecesRepository dossierDecesRepository;

    @Transactional(readOnly = true)
    public List<AyantDroitResponse> findByDossier(Long dossierId) {
        requireDossier(dossierId);
        return ayantDroitRepository.findByDossier_Id(dossierId)
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public AyantDroitResponse create(Long dossierId, AyantDroitRequest req) {
        DossierDeces dossier = requireDossier(dossierId);
        AyantDroit entity = new AyantDroit();
        map(req, entity);
        entity.setDossier(dossier);
        return toResponse(ayantDroitRepository.save(entity));
    }

    @Transactional
    public AyantDroitResponse update(Long dossierId, Long id, AyantDroitRequest req) {
        requireDossier(dossierId);
        AyantDroit entity = ayantDroitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Ayant droit introuvable : " + id));
        map(req, entity);
        return toResponse(ayantDroitRepository.save(entity));
    }

    @Transactional
    public void delete(Long dossierId, Long id) {
        requireDossier(dossierId);
        if (!ayantDroitRepository.existsById(id))
            throw new NotFoundException("Ayant droit introuvable : " + id);
        ayantDroitRepository.deleteById(id);
    }

    private DossierDeces requireDossier(Long dossierId) {
        return dossierDecesRepository.findById(dossierId)
                .orElseThrow(() -> new NotFoundException("Dossier décès introuvable : " + dossierId));
    }

    private void map(AyantDroitRequest req, AyantDroit entity) {
        entity.setNom(req.nom());
        entity.setPrenom(req.prenom());
        entity.setCin(req.cin());
        entity.setLienParente(req.lienParente());
        entity.setDateNaissance(req.dateNaissance());
        entity.setTelephone(req.telephone());
        entity.setAdresse(req.adresse());
        entity.setTypeRepartition(req.typeRepartition());
        entity.setPourcentage(req.pourcentage());
    }

    private AyantDroitResponse toResponse(AyantDroit a) {
        return new AyantDroitResponse(
                a.getId(),
                a.getDossier().getId(),
                a.getNom(),
                a.getPrenom(),
                a.getCin(),
                a.getLienParente(),
                a.getDateNaissance(),
                a.getTelephone(),
                a.getAdresse(),
                a.getTypeRepartition() != null ? a.getTypeRepartition().name() : null,
                a.getPourcentage()
        );
    }
}
