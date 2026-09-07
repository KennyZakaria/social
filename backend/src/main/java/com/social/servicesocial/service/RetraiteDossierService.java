package com.social.servicesocial.service;

import com.social.servicesocial.dto.RetraiteDossierRequest;
import com.social.servicesocial.dto.RetraiteDossierResponse;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.Dossier;
import com.social.servicesocial.model.DossierRetraite;
import com.social.servicesocial.model.DossierStatut;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.repository.DossierRepository;
import com.social.servicesocial.repository.DossierRetraiteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RetraiteDossierService {
    private final DossierRetraiteRepository retraiteRepository;
    private final DossierRepository dossierRepository;

    @Transactional(readOnly = true)
    public List<RetraiteDossierResponse> list() {
        return retraiteRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public RetraiteDossierResponse get(Long id) { return toResponse(required(id)); }

    @Transactional
    public RetraiteDossierResponse create(RetraiteDossierRequest request) {
        String reference = "RET-" + LocalDate.now().getYear() + "-" + System.currentTimeMillis();
        Dossier dossier = Dossier.builder()
                .section(SocialModule.RETRAITES).numero(reference)
                .adherentNom(fullName(request)).matricule(value(request.matricule()))
                .dateEvenement(request.dateRadiation()).nature("RETRAITE")
                .description(request.motif()).statut(DossierStatut.EN_COURS).build();
        dossier = dossierRepository.save(dossier);
        DossierRetraite retraite = DossierRetraite.builder().dossier(dossier).build();
        apply(retraite, request);
        return toResponse(retraiteRepository.save(retraite));
    }

    @Transactional
    public RetraiteDossierResponse update(Long id, RetraiteDossierRequest request) {
        DossierRetraite retraite = required(id);
        if (retraite.getStatut() == DossierStatut.CLOTURE) {
            throw new IllegalStateException("Un dossier clôturé ne peut pas être modifié");
        }
        apply(retraite, request);
        Dossier dossier = retraite.getDossier();
        dossier.setAdherentNom(fullName(request));
        dossier.setMatricule(value(request.matricule()));
        dossier.setDateEvenement(request.dateRadiation());
        dossier.setDescription(request.motif());
        dossier.setStatut(retraite.getStatut());
        return toResponse(retraiteRepository.save(retraite));
    }

    @Transactional
    public RetraiteDossierResponse close(Long id) {
        DossierRetraite retraite = required(id);
        retraite.setStatut(DossierStatut.CLOTURE);
        retraite.getDossier().setStatut(DossierStatut.CLOTURE);
        return toResponse(retraiteRepository.save(retraite));
    }

    private DossierRetraite required(Long id) {
        return retraiteRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dossier retraite introuvable : " + id));
    }

    private void apply(DossierRetraite target, RetraiteDossierRequest r) {
        target.setAdherentId(r.adherentId()); target.setNom(r.nom()); target.setPrenom(r.prenom());
        target.setCin(r.cin()); target.setMatriculeBr(r.matriculeBr()); target.setGrade(r.grade());
        target.setDateNaissance(r.dateNaissance()); target.setDateRadiation(r.dateRadiation());
        target.setMotif(r.motif()); target.setTelephoneGsm(r.telephoneGsm()); target.setTelephoneFixe(r.telephoneFixe());
        target.setAffectation(r.affectation()); target.setAdresse(r.adresse());
        target.setSituationFamiliale(r.situationFamiliale()); target.setHabitation(r.habitation());
        target.setProprietaire(r.proprietaire()); target.setLocataire(r.locataire());
        target.setHabitationPrecision(r.habitationPrecision()); target.setDateEnquete(r.dateEnquete());
        target.setStatut(r.statut() == null ? DossierStatut.EN_COURS : r.statut());
    }

    private RetraiteDossierResponse toResponse(DossierRetraite d) {
        return new RetraiteDossierResponse(d.getId(), d.getDossier().getNumero(), d.getAdherentId(),
                d.getNom(), d.getPrenom(), d.getDossier().getMatricule(), d.getCin(), d.getGrade(),
                d.getDateRadiation(), d.getSituationFamiliale(), d.getStatut(), d.getDateCreation(), d.getDateMaj());
    }

    private String fullName(RetraiteDossierRequest r) { return (r.prenom() + " " + r.nom()).trim(); }
    private String value(String value) { return value == null || value.isBlank() ? "N/A" : value; }
}
