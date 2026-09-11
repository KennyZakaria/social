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
    private final jakarta.persistence.EntityManager entityManager;
    private final jakarta.validation.Validator validator;
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
        validateRequest(request);
        if (request.adherentId() == null) throw new IllegalArgumentException("Selectionnez un adherent avant de creer le dossier.");
        // Lock the adherent so concurrent creations cannot produce duplicate dossiers.
        var adherent = entityManager.find(Adherent.class, request.adherentId(), jakarta.persistence.LockModeType.PESSIMISTIC_WRITE);
        if (adherent == null) throw new NotFoundException("Adherent introuvable");
        if (retraiteRepository.existsByAdherentId(request.adherentId()) || retraiteRepository.existsByDossierMatriculeIgnoreCase(request.matricule().trim()))
            throw new com.social.servicesocial.exception.ConflictException("Un dossier retraite existe deja pour cet adherent.");
        String reference = "RET-" + LocalDate.now().getYear() + "-"
                + java.util.UUID.randomUUID().toString().replace("-", "").substring(0, 30);
        Dossier dossier = Dossier.builder()
                .section(SocialModule.RETRAITES).numero(reference)
                .adherentNom(fullName(request)).matricule(value(request.matricule()))
                .dateEvenement(request.dateRadiation()).nature("RETRAITE")
                .description(request.motif()).statut(DossierStatut.EN_COURS).build();
        dossier = dossierRepository.save(dossier);
        DossierRetraite retraite = DossierRetraite.builder().dossier(dossier).build();
        apply(retraite, request);
        retraite = retraiteRepository.save(retraite);
        reference = "RET-" + LocalDate.now().getYear() + "-"
                + String.format(java.util.Locale.ROOT, "%03d", retraite.getId());
        dossier.setNumero(reference);
        replaceDetails(retraite, request);
        record(retraite, "Dossier créé", "Création du dossier " + reference);
        return toResponse(retraite);
    }

    @Transactional
    public RetraiteDossierResponse update(Long id, RetraiteDossierRequest request) {
        DossierRetraite retraite = requiredForUpdate(id);
        if (retraite.getStatut() == DossierStatut.CLOTURE) {
            throw new com.social.servicesocial.exception.ConflictException("Un dossier clôturé ne peut pas être modifié");
        }
        validateRequest(request);
        if (!java.util.Objects.equals(retraite.getAdherentId(), request.adherentId()))
            throw new com.social.servicesocial.exception.ConflictException("L'adherent du dossier ne peut pas etre remplace.");
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
        DossierRetraite retraite = requiredForUpdate(id);
        if (retraite.getStatut() == DossierStatut.CLOTURE) return toResponse(retraite);
        var data = toResponse(retraite);
        validateIdentity(data.nom(), data.prenom(), data.cin(), data.matricule(), data.telephoneGsm());
        if (data.proprietaire() && data.locataire()) throw new IllegalArgumentException("Choisissez proprietaire ou locataire.");
        validateRows(data.famille()); validateRows(data.donneesMedicoSociales());
        validateRows(data.assistances()); validateRows(data.ressources()); validateRows(data.charges()); validateRows(data.pieces()); validateRows(data.affiliations());
        retraite.setDateMaj(java.time.LocalDateTime.now());
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

    private DossierRetraite requiredForUpdate(Long id) {
        var dossier = entityManager.find(DossierRetraite.class, id, jakarta.persistence.LockModeType.PESSIMISTIC_WRITE);
        if (dossier == null) throw new NotFoundException("Dossier retraite introuvable : " + id);
        return dossier;
    }

    private void validateIdentity(String... fields) {
        for (String field : fields) if (field == null || field.isBlank())
            throw new IllegalArgumentException("Nom, prenom, CIN, matricule et telephone sont obligatoires avant enregistrement ou cloture.");
    }

    private void validateRows(List<?> rows) {
        if (rows != null) rows.forEach(this::validateBean);
    }

    private void validateBean(Object value) {
        if (value == null) throw new IllegalArgumentException("Une rubrique contient une ligne vide.");
        var errors = validator.validate(value);
        if (!errors.isEmpty()) throw new IllegalArgumentException(errors.stream()
                .map(e -> e.getPropertyPath() + ": " + e.getMessage()).sorted().collect(java.util.stream.Collectors.joining(", ")));
    }

    private void validateRequest(RetraiteDossierRequest r) {
        validateBean(r);
        if (r.statut() != null && r.statut() != DossierStatut.EN_COURS)
            throw new IllegalArgumentException("Utilisez la validation et cloture pour terminer le dossier.");
        if (r.proprietaire() && r.locataire()) throw new IllegalArgumentException("Choisissez proprietaire ou locataire.");
    }

    private void apply(DossierRetraite target, RetraiteDossierRequest r) {
        if (r.photo() != null) target.setPhoto(r.photo());
        target.setNomAr(r.nomAr());
        target.setPrenomAr(r.prenomAr());
        target.setLieuNaissance(r.lieuNaissance());
        target.setMatriculeCorps(r.matriculeCorps());
        target.setCategorie(r.categorie());
        target.setSituationCategorie(r.situationCategorie());
        target.setPension(r.pension());
        target.setDateEntreeService(r.dateEntreeService());
        target.setMotifRadiationSanction(r.motifRadiationSanction());
        target.setDateDeces(r.dateDeces());
        target.setCauseDeces(r.causeDeces());
        target.setNatureDeces(r.natureDeces());
        target.setFormationUnite(r.formationUnite());
        target.setDerniereRegion(r.derniereRegion());
        target.setTelephoneGsm2(r.telephoneGsm2());
        target.setEmail(r.email());
        target.setObservation(r.observation());
        target.setAdresseEM(r.adresseEM());
        target.setCode(r.code());
        target.setCarteFondation(r.carteFondation());
        target.setNumeroPmr(r.numeroPmr());
        target.setMontantPmr(r.montantPmr());
        target.setNumeroPmi(r.numeroPmi());
        target.setMontantPmi(r.montantPmi());
        target.setProfessionActuelle(r.professionActuelle());
        target.setColisRamadan(r.colisRamadan());
        target.setRegionResidence(r.regionResidence());
        target.setHayRabat(r.hayRabat());
        target.setObservationSociale(r.observationSociale());
        target.setMotifEnquete(r.motifEnquete());
        target.setNumeroDossier(r.numeroDossier());
        target.setCartePrelevementCmr(r.cartePrelevementCmr());
        target.setSituationFraternelle(r.situationFraternelle());
        target.setAnneeAdhesion(r.anneeAdhesion());
        target.setModeReglement(r.modeReglement());
        target.setNumeroRecu(r.numeroRecu());
        target.setDatePaiement(r.datePaiement());
        target.setObservationAdhesion(r.observationAdhesion());
        target.setAvecPhoto(r.avecPhoto());
        if (r.pieces() != null) {
            var pieces = r.pieces().stream().map(p -> new RetraitePiece(p.quantite() == null ? 1 : p.quantite(), p.type(), p.nom(), p.mime(), p.contenu())).toList();
            if (target.getPieces() == null) target.setPieces(new java.util.ArrayList<>());
            target.getPieces().clear(); target.getPieces().addAll(pieces);
        }
        target.setAdherentId(r.adherentId()); target.setNom(r.nom()); target.setPrenom(r.prenom());
        target.setCin(r.cin()); target.setMatriculeBr(r.matriculeBr()); target.setGrade(r.grade());
        target.setDateNaissance(r.dateNaissance()); target.setDateRadiation(r.dateRadiation());
        target.setMotif(r.motif()); target.setTelephoneGsm(r.telephoneGsm()); target.setTelephoneFixe(r.telephoneFixe());
        target.setAffectation(r.affectation()); target.setAdresse(r.adresse());
        target.setSituationFamiliale(r.situationFamiliale()); target.setHabitation(r.habitation());
        target.setProprietaire(r.proprietaire()); target.setLocataire(r.locataire());
        target.setHabitationPrecision(r.habitationPrecision()); target.setDateEnquete(r.dateEnquete());
        target.setStatut(DossierStatut.EN_COURS);
        target.setDateMaj(java.time.LocalDateTime.now());
    }

    private RetraiteDossierResponse toResponse(DossierRetraite d) {
        return new RetraiteDossierResponse(d.getNomAr(), d.getPrenomAr(), d.getLieuNaissance(), d.getMatriculeCorps(), d.getCategorie(), d.getSituationCategorie(), d.getPension(), d.getDateEntreeService(), d.getMotifRadiationSanction(), d.getDateDeces(), d.getCauseDeces(), d.getNatureDeces(), d.getFormationUnite(), d.getDerniereRegion(), d.getTelephoneGsm2(), d.getEmail(), d.getObservation(), d.getAdresseEM(), d.getCode(), d.getCarteFondation(), d.getNumeroPmr(), d.getMontantPmr(), d.getNumeroPmi(), d.getMontantPmi(), d.getProfessionActuelle(), d.getColisRamadan(), d.getRegionResidence(), d.getHayRabat(), d.getObservationSociale(), d.getMotifEnquete(), d.getNumeroDossier(), d.getCartePrelevementCmr(), d.getSituationFraternelle(), d.getAnneeAdhesion(), d.getModeReglement(), d.getNumeroRecu(), d.getDatePaiement(), d.getObservationAdhesion(), d.getAvecPhoto(), (d.getPieces() == null ? List.<RetraitePieceDto>of() : d.getPieces().stream().map(p -> new RetraitePieceDto(p.getQuantite() == null ? 1 : p.getQuantite(), p.getType(), p.getNom(), p.getMime(), p.getContenu())).toList()), d.getPhoto(), d.getId(), d.getDossier().getNumero(), d.getAdherentId(),
                d.getNom(), d.getPrenom(), d.getDossier().getMatricule(), d.getCin(), d.getMatriculeBr(), d.getGrade(),
                d.getDateNaissance(), d.getDateRadiation(), d.getMotif(), d.getTelephoneGsm(), d.getTelephoneFixe(),
                d.getAffectation(), d.getAdresse(), d.getSituationFamiliale(), d.getHabitation(), d.isProprietaire(),
                d.isLocataire(), d.getHabitationPrecision(), d.getDateEnquete(), d.getStatut(), d.getDateCreation(), d.getDateMaj(),
                affiliationRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteAffiliationDto(x.getTypeCarte(), x.isTitulaire(), x.getNumeroCarte(), x.getObservation())).toList(),
                familleRepository.findByDossierRetraiteId(d.getId()).stream().map(x -> new RetraiteMembreFamilleDto(x.getLieu(), x.getMutuelle(), x.getLieuTravail(), x.getMariage(), x.getDivorce(), x.getSituationFamiliale(), x.getLien(), x.getType(), x.getNom(), x.getPrenom(), x.getDateNaissance(), x.getCin(), x.getActivite(), x.getNiveauInstruction(), x.getEmploi(), x.isPersonneACharge())).toList(),
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
        if (r.famille()!=null) r.famille().forEach(x->familleRepository.save(RetraiteMembreFamille.builder().dossierRetraite(d).lieu(x.lieu()).mutuelle(x.mutuelle()).lieuTravail(x.lieuTravail()).mariage(x.mariage()).divorce(x.divorce()).situationFamiliale(x.situationFamiliale()).lien(x.lien()).type(x.type()).nom(x.nom()).prenom(x.prenom()).dateNaissance(x.dateNaissance()).cin(x.cin()).activite(x.activite()).niveauInstruction(x.niveauInstruction()).emploi(x.emploi()).personneACharge(x.personneACharge()).build()));
        if (r.donneesMedicoSociales()!=null) r.donneesMedicoSociales().forEach(x->medicalRepository.save(RetraiteDonneeMedicoSociale.builder().dossierRetraite(d).identification(x.identification()).diagnostic(x.diagnostic()).duree(x.duree()).build()));
        if (r.assistances()!=null) r.assistances().forEach(x->assistanceRepository.save(RetraiteAssistance.builder().dossierRetraite(d).nature(x.nature()).organisme(x.organisme()).dateAssistance(x.date()).observation(x.observation()).build()));
        if (r.ressources()!=null) r.ressources().forEach(x->ressourceRepository.save(RetraiteRessourceMensuelle.builder().dossierRetraite(d).designation(x.designation()).montant(x.montant()).build()));
        if (r.charges()!=null) r.charges().forEach(x->chargeRepository.save(RetraiteChargeMensuelle.builder().dossierRetraite(d).designation(x.designation()).montant(x.montant()).build()));
    }
}
