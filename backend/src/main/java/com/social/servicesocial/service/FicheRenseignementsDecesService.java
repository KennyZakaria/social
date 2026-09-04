package com.social.servicesocial.service;

import com.social.servicesocial.dto.FicheRenseignementsDecesRequest;
import com.social.servicesocial.dto.FicheRenseignementsDecesResponse;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.*;
import com.social.servicesocial.repository.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FicheRenseignementsDecesService {
    private static final BigDecimal ZERO = BigDecimal.ZERO;
    private final DossierDecesRepository dossierRepository;
    private final AdherentRepository adherentRepository;
    private final AyantDroitRepository ayantRepository;
    private final LiquidationDroitDecesRepository liquidationRepository;
    private final PensionDecesRepository pensionRepository;
    private final AssuranceDecesRepository assuranceRepository;
    private final SituationFinanciereDecesRepository situationRepository;
    private final AssistanceOctroyeeDecesRepository assistanceRepository;
    private final DossierDecesHistoriqueRepository historiqueRepository;

    @Transactional(readOnly = true)
    public FicheRenseignementsDecesResponse get(Long dossierId) {
        DossierDeces dossier = requiredDossier(dossierId);
        Adherent adherent = requiredAdherent(dossier.getAdherentId());
        List<AyantDroit> ayants = ayantRepository.findByAdherentIdOrderByIdAsc(adherent.getId());
        return response(dossier, adherent, ayants);
    }

    @Transactional
    public FicheRenseignementsDecesResponse update(Long dossierId, FicheRenseignementsDecesRequest request, String username) {
        DossierDeces dossier = requiredDossier(dossierId);
        Adherent adherent = requiredAdherent(dossier.getAdherentId());
        Map<Long, AyantDroit> ayants = ayantsFor(adherent.getId());
        boolean firstSave = isEmptyFiche(dossier);
        dossier.setObservation(blankToNull(request.observation()));

        liquidationRepository.deleteByDossierId(dossierId);
        pensionRepository.deleteByDossierId(dossierId);
        assuranceRepository.deleteByDossierId(dossierId);
        assistanceRepository.deleteByDossierId(dossierId);
        saveLiquidations(dossier, request.liquidations());
        savePensions(dossier, request.pensions(), ayants);
        saveAssurances(dossier, request.assurances(), ayants);
        saveAssistances(dossier, request.assistancesOctroyees());
        saveSituation(dossier, request.situationFinanciere());
        dossierRepository.save(dossier);
        addHistorique(dossierId, firstSave ? "CREATION_FICHE" : "MODIFICATION_FICHE", "Mise a jour de la fiche de renseignements", username);
        return response(dossier, adherent, new ArrayList<>(ayants.values()));
    }

    @Transactional
    public void recordExport(Long dossierId, String username) {
        requiredDossier(dossierId);
        addHistorique(dossierId, "EXPORT_FICHE_PDF", "Export de la fiche PDF", username);
    }

    private boolean isEmptyFiche(DossierDeces dossier) {
        return (dossier.getObservation() == null || dossier.getObservation().isBlank())
                && liquidationRepository.findByDossierIdOrderByIdAsc(dossier.getId()).isEmpty()
                && pensionRepository.findByDossierIdOrderByIdAsc(dossier.getId()).isEmpty()
                && assuranceRepository.findByDossierIdOrderByIdAsc(dossier.getId()).isEmpty()
                && assistanceRepository.findByDossierIdOrderByIdAsc(dossier.getId()).isEmpty()
                && situationRepository.findByDossierId(dossier.getId()).isEmpty();
    }
    private FicheRenseignementsDecesResponse response(DossierDeces dossier, Adherent adherent, List<AyantDroit> ayants) {
        List<FicheRenseignementsDecesResponse.Ayant> all = ayants.stream().map(this::ayant).toList();
        FicheRenseignementsDecesResponse.Ayant veufVeuve = all.stream().filter(a -> relation(a.lienParente(), "veuf", "veuve", "conjoint", "conjointe")).findFirst().orElse(null);
        List<FicheRenseignementsDecesResponse.Ayant> orphelins = all.stream()
                .filter(a -> relation(a.lienParente(), "orphelin") || (isChild(a) && isMinor(a)))
                .toList();
        List<FicheRenseignementsDecesResponse.Ayant> ascendants = all.stream()
                .filter(a -> relation(a.lienParente(), "pere", "mere", "parent", "ascendant") || (isChild(a) && !isMinor(a)))
                .toList();
        Set<Long> classified = new HashSet<>();
        if (veufVeuve != null) classified.add(veufVeuve.id());
        orphelins.forEach(a -> classified.add(a.id())); ascendants.forEach(a -> classified.add(a.id()));
        List<FicheRenseignementsDecesResponse.Ayant> autres = all.stream().filter(a -> !classified.contains(a.id())).toList();
        SituationFinanciereDeces sf = situationRepository.findByDossierId(dossier.getId()).orElse(null);
        return new FicheRenseignementsDecesResponse(
                dossier.getId(), dossier.getNumero(),
                new FicheRenseignementsDecesResponse.InformationsAdherent(adherent.getId(), adherent.getNomAr(), adherent.getPrenomAr(), adherent.getGrade(), adherent.getMatricule(), adherent.getMatriculeBR(), adherent.getCin(), adherent.getDateNaissance(), adherent.getLieuNaissance(), adherent.getDernierUnite(), adherent.getSituationCategorie()),
                new FicheRenseignementsDecesResponse.InformationsDeces(dossier.getDateDeces(), dossier.getLieuDeces(), dossier.getCauseDeces(), dossier.getDpr(), dossier.getDateCreation(), dossier.getDateMaj()),
                veufVeuve, orphelins, ascendants, autres,
                liquidationRepository.findByDossierIdOrderByIdAsc(dossier.getId()).stream().map(x -> new FicheRenseignementsDecesResponse.Liquidation(x.getId(), x.getDesignation(), x.getMontant(), x.getBeneficiaire(), x.getReference())).toList(),
                pensionRepository.findByDossierIdOrderByIdAsc(dossier.getId()).stream().map(x -> new FicheRenseignementsDecesResponse.Pension(x.getId(), x.getTypeBeneficiaire(), x.getAyantDroit() == null ? null : x.getAyantDroit().getId(), x.getNumero(), x.getMontant())).toList(),
                assuranceRepository.findByDossierIdOrderByIdAsc(dossier.getId()).stream().map(x -> new FicheRenseignementsDecesResponse.Assurance(x.getId(), x.getTypeBeneficiaire(), x.getAyantDroit() == null ? null : x.getAyantDroit().getId(), x.getNumeroCheque(), x.getMontant())).toList(),
                situation(sf),
                assistanceRepository.findByDossierIdOrderByIdAsc(dossier.getId()).stream().map(x -> new FicheRenseignementsDecesResponse.Assistance(x.getId(), x.getDesignation(), x.getMontant(), x.getDate(), x.getChequeReference())).toList(),
                dossier.getObservation());
    }

    private void saveLiquidations(DossierDeces d, List<FicheRenseignementsDecesRequest.LiquidationInput> values) { for (var x : safe(values)) liquidationRepository.save(LiquidationDroitDeces.builder().dossier(d).designation(x.designation().trim()).montant(amount(x.montant())).beneficiaire(blankToNull(x.beneficiaire())).reference(blankToNull(x.reference())).build()); }
    private void savePensions(DossierDeces d, List<FicheRenseignementsDecesRequest.PensionInput> values, Map<Long, AyantDroit> ayants) { for (var x : safe(values)) pensionRepository.save(PensionDeces.builder().dossier(d).typeBeneficiaire(x.typeBeneficiaire().trim()).ayantDroit(requiredAyant(x.ayantDroitId(), ayants)).numero(blankToNull(x.numero())).montant(amount(x.montant())).build()); }
    private void saveAssurances(DossierDeces d, List<FicheRenseignementsDecesRequest.AssuranceInput> values, Map<Long, AyantDroit> ayants) { for (var x : safe(values)) assuranceRepository.save(AssuranceDeces.builder().dossier(d).typeBeneficiaire(x.typeBeneficiaire().trim()).ayantDroit(requiredAyant(x.ayantDroitId(), ayants)).numeroCheque(blankToNull(x.numeroCheque())).montant(amount(x.montant())).build()); }
    private void saveAssistances(DossierDeces d, List<FicheRenseignementsDecesRequest.AssistanceInput> values) { for (var x : safe(values)) assistanceRepository.save(AssistanceOctroyeeDeces.builder().dossier(d).designation(x.designation().trim()).montant(amount(x.montant())).date(x.date()).chequeReference(blankToNull(x.chequeReference())).build()); }
    private void saveSituation(DossierDeces d, FicheRenseignementsDecesRequest.SituationFinanciereInput x) { if (x == null) return; SituationFinanciereDeces s = situationRepository.findByDossierId(d.getId()).orElseGet(() -> SituationFinanciereDeces.builder().dossier(d).build()); s.setPmr(amount(x.pmr()));s.setPmi(amount(x.pmi()));s.setSalaire(amount(x.salaire()));s.setAutresRessources(amount(x.autresRessources()));s.setEauElectricite(amount(x.eauElectricite()));s.setFraisMedicaux(amount(x.fraisMedicaux()));s.setFraisScolarite(amount(x.fraisScolarite()));s.setLoyer(amount(x.loyer()));s.setAutresCharges(amount(x.autresCharges()));situationRepository.save(s); }
    private FicheRenseignementsDecesResponse.SituationFinanciere situation(SituationFinanciereDeces s) { BigDecimal pmr = value(s == null ? null : s.getPmr()), pmi = value(s == null ? null : s.getPmi()), salaire = value(s == null ? null : s.getSalaire()), autres = value(s == null ? null : s.getAutresRessources()), eau = value(s == null ? null : s.getEauElectricite()), med = value(s == null ? null : s.getFraisMedicaux()), scol = value(s == null ? null : s.getFraisScolarite()), loyer = value(s == null ? null : s.getLoyer()), autresC = value(s == null ? null : s.getAutresCharges()); BigDecimal ressources = pmr.add(pmi).add(salaire).add(autres), charges = eau.add(med).add(scol).add(loyer).add(autresC); return new FicheRenseignementsDecesResponse.SituationFinanciere(pmr,pmi,salaire,autres,eau,med,scol,loyer,autresC,ressources,charges,ressources.subtract(charges)); }
    private FicheRenseignementsDecesResponse.Ayant ayant(AyantDroit a) { return new FicheRenseignementsDecesResponse.Ayant(a.getId(), a.getNom(), a.getPrenom(), a.getDateNaissance(), a.getLieuNaissance(), a.getCin(), a.getSituationFamiliale(), a.getNiveauInstruction(), a.getActiviteEmploi(), a.getAdresse(), a.getLienParente()); }
    private Map<Long, AyantDroit> ayantsFor(Long adherentId) { Map<Long, AyantDroit> result = new LinkedHashMap<>(); ayantRepository.findByAdherentIdOrderByIdAsc(adherentId).forEach(a -> result.put(a.getId(), a)); return result; }
    private AyantDroit requiredAyant(Long id, Map<Long, AyantDroit> ayants) { if (id == null) return null; AyantDroit a = ayants.get(id); if (a == null) throw new IllegalArgumentException("L'ayant droit selectionne n'appartient pas a l'adherent du dossier."); return a; }
    private DossierDeces requiredDossier(Long id) { return dossierRepository.findById(id).orElseThrow(() -> new NotFoundException("Dossier deces introuvable : " + id)); }
    private Adherent requiredAdherent(Long id) { return adherentRepository.findById(id).orElseThrow(() -> new NotFoundException("Adherent introuvable : " + id)); }
    private void addHistorique(Long id, String action, String commentaire, String username) { historiqueRepository.save(DossierDecesHistorique.builder().dossierId(id).action(action).commentaire(commentaire).username(username == null ? "system" : username).dateAction(LocalDateTime.now()).build()); }
    private static boolean isChild(FicheRenseignementsDecesResponse.Ayant ayant) {
        return relation(ayant.lienParente(), "fils", "fille");
    }

    private static boolean isMinor(FicheRenseignementsDecesResponse.Ayant ayant) {
        return ayant.dateNaissance() != null
                && java.time.Period.between(ayant.dateNaissance(), java.time.LocalDate.now()).getYears() < 18;
    }
    private static boolean relation(String value, String... terms) { String v = value == null ? "" : value.toLowerCase(Locale.ROOT); return Arrays.stream(terms).anyMatch(v::contains); }
    private static BigDecimal value(BigDecimal x) { return x == null ? ZERO : x; }
    private static BigDecimal amount(BigDecimal x) { return x == null ? ZERO : x; }
    private static String blankToNull(String x) { return x == null || x.isBlank() ? null : x.trim(); }
    private static <T> List<T> safe(List<T> x) { return x == null ? List.of() : x; }
}