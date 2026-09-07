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
import com.social.servicesocial.dto.*;
import com.social.servicesocial.model.*;
import com.social.servicesocial.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RetraiteDossierService {
    private final DossierRetraiteRepository retraiteRepository;
    private final DossierRepository dossierRepository;
    private final RetraiteAffiliationRepository affiliationRepository;
    private final RetraiteMembreFamilleRepository familleRepository;
    private final RetraiteDonneeMedicoSocialeRepository medicalRepository;
    private final RetraiteAssistanceRepository assistanceRepository;
    private final RetraiteRessourceMensuelleRepository ressourceRepository;
    private final RetraiteChargeMensuelleRepository chargeRepository;
    private final RetraiteHistoriqueRepository historiqueRepository;

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
        retraite = retraiteRepository.save(retraite); replaceDetails(retraite, request); record(retraite, "Dossier créé", "Création du dossier " + reference); return toResponse(retraite);
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
        retraite = retraiteRepository.save(retraite); replaceDetails(retraite, request); record(retraite, "Dossier mis à jour", "Informations administratives et sociales mises à jour"); return toResponse(retraite);
    }

    @Transactional
    public RetraiteDossierResponse close(Long id) {
        DossierRetraite retraite = required(id);
        retraite.setStatut(DossierStatut.CLOTURE);
        retraite.getDossier().setStatut(DossierStatut.CLOTURE);
        retraite = retraiteRepository.save(retraite);
        record(retraite, "Dossier validé et clôturé", "Le dossier n’est plus modifiable");
        return toResponse(retraite);
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
                d.getNom(), d.getPrenom(), d.getDossier().getMatricule(), d.getCin(), d.getMatriculeBr(), d.getGrade(),
                d.getDateNaissance(), d.getDateRadiation(), d.getMotif(), d.getTelephoneGsm(), d.getTelephoneFixe(),
                d.getAffectation(), d.getAdresse(), d.getSituationFamiliale(), d.getHabitation(), d.isProprietaire(),
                d.isLocataire(), d.getHabitationPrecision(), d.getDateEnquete(), d.getStatut(), d.getDateCreation(), d.getDateMaj(),
                affiliationRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteAffiliationDto(x.getTypeCarte(), x.isTitulaire(), x.getNumeroCarte(), x.getObservation())).toList(),
                familleRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteMembreFamilleDto(x.getType(), x.getNom(), x.getPrenom(), x.getDateNaissance(), x.getCin(), x.getActivite(), x.getNiveauInstruction(), x.getEmploi(), x.isPersonneACharge())).toList(),
                medicalRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteMedicalDto(x.getIdentification(), x.getDiagnostic(), x.getDuree())).toList(),
                assistanceRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteAssistanceDto(x.getNature(), x.getOrganisme(), x.getDateAssistance(), x.getObservation())).toList(),
                ressourceRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteBudgetDto(x.getDesignation(), x.getMontant())).toList(),
                chargeRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteBudgetDto(x.getDesignation(), x.getMontant())).toList(),
                historiqueRepository.findByDossierRetraiteIdOrderByDateActionDesc(d.getId()).stream().map(x -> new RetraiteHistoriqueDto(x.getId(), x.getAction(), x.getDetail(), x.getDateAction())).toList());
    }

    private String fullName(RetraiteDossierRequest r) { return (r.prenom() + " " + r.nom()).trim(); }
    private String value(String value) { return value == null || value.isBlank() ? "N/A" : value; }
    private void record(DossierRetraite dossier, String action, String detail) { historiqueRepository.save(RetraiteHistorique.builder().dossierRetraite(dossier).action(action).detail(detail).build()); }
    private void replaceDetails(DossierRetraite d, RetraiteDossierRequest r) {
        affiliationRepository.deleteAll(affiliationRepository.findByDossierRetraiteId(d.getId()));
        familleRepository.deleteAll(familleRepository.findByDossierRetraiteId(d.getId()));
        medicalRepository.deleteAll(medicalRepository.findByDossierRetraiteId(d.getId()));
        assistanceRepository.deleteAll(assistanceRepository.findByDossierRetraiteId(d.getId()));
        ressourceRepository.deleteAll(ressourceRepository.findByDossierRetraiteId(d.getId()));
        chargeRepository.deleteAll(chargeRepository.findByDossierRetraiteId(d.getId()));
        if (r.affiliations()!=null) r.affiliations().forEach(x->affiliationRepository.save(RetraiteAffiliation.builder().dossierRetraite(d).typeCarte(x.typeCarte()).titulaire(x.titulaire()).numeroCarte(x.numeroCarte()).observation(x.observation()).build()));
        if (r.famille()!=null) r.famille().forEach(x->familleRepository.save(RetraiteMembreFamille.builder().dossierRetraite(d).type(x.type()).nom(x.nom()).prenom(x.prenom()).dateNaissance(x.dateNaissance()).cin(x.cin()).activite(x.activite()).niveauInstruction(x.niveauInstruction()).emploi(x.emploi()).personneACharge(x.personneACharge()).build()));
        if (r.donneesMedicoSociales()!=null) r.donneesMedicoSociales().forEach(x->medicalRepository.save(RetraiteDonneeMedicoSociale.builder().dossierRetraite(d).identification(x.identification()).diagnostic(x.diagnostic()).duree(x.duree()).build()));
        if (r.assistances()!=null) r.assistances().forEach(x->assistanceRepository.save(RetraiteAssistance.builder().dossierRetraite(d).nature(x.nature()).organisme(x.organisme()).dateAssistance(x.date()).observation(x.observation()).build()));
        if (r.ressources()!=null) r.ressources().forEach(x->ressourceRepository.save(RetraiteRessourceMensuelle.builder().dossierRetraite(d).designation(x.designation()).montant(x.montant()).build()));
        if (r.charges()!=null) r.charges().forEach(x->chargeRepository.save(RetraiteChargeMensuelle.builder().dossierRetraite(d).designation(x.designation()).montant(x.montant()).build()));
    }
}
