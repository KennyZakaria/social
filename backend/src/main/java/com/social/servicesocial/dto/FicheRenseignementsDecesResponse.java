package com.social.servicesocial.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record FicheRenseignementsDecesResponse(
        Long dossierId, String numeroDossier, InformationsAdherent adherent, InformationsDeces deces,
        Ayant veufVeuve, List<Ayant> orphelins, List<Ayant> ascendants, List<Ayant> autresAyantsDroit,
        List<Liquidation> liquidations, List<Pension> pensions, List<Assurance> assurances,
        SituationFinanciere situationFinanciere, List<Assistance> assistancesOctroyees, String observation
) {
    public record InformationsAdherent(Long id, String nom, String prenom, String grade, String matricule, String matriculeBR,
            String cin, LocalDate dateNaissance, String lieuNaissance, String derniereUnite, String situationCategorie) {}
    public record InformationsDeces(LocalDate dateDeces, String lieuDeces, String causeDeces, String dpr,
            LocalDateTime dateFiche, LocalDateTime dateMiseAJour) {}
    public record Ayant(Long id, String nom, String prenom, LocalDate dateNaissance, String lieuNaissance, String cin,
            String situationFamiliale, String niveauInstruction, String activiteEmploi, String adresse, String lienParente) {}
    public record Liquidation(Long id, String designation, BigDecimal montant, String beneficiaire, String reference) {}
    public record Pension(Long id, String typeBeneficiaire, Long ayantDroitId, String numero, BigDecimal montant) {}
    public record Assurance(Long id, String typeBeneficiaire, Long ayantDroitId, String numeroCheque, BigDecimal montant) {}
    public record SituationFinanciere(BigDecimal pmr, BigDecimal pmi, BigDecimal salaire, BigDecimal autresRessources,
            BigDecimal eauElectricite, BigDecimal fraisMedicaux, BigDecimal fraisScolarite, BigDecimal loyer,
            BigDecimal autresCharges, BigDecimal totalRessources, BigDecimal totalCharges, BigDecimal balance) {}
    public record Assistance(Long id, String designation, BigDecimal montant, LocalDate date, String chequeReference) {}
}