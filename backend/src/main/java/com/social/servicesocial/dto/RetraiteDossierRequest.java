package com.social.servicesocial.dto;

import java.time.LocalDate;
import java.util.List;

import com.social.servicesocial.model.DossierStatut;

import jakarta.validation.constraints.NotBlank;

public record RetraiteDossierRequest(
        Long adherentId,
        @NotBlank String nom,
        @NotBlank String prenom,
        String matricule,
        String cin,
        String matriculeBr,
        String grade,
        LocalDate dateNaissance,
        LocalDate dateRadiation,
        String motif,
        String telephoneGsm,
        String telephoneFixe,
        String affectation,
        String adresse,
        String situationFamiliale,
        String habitation,
        boolean proprietaire,
        boolean locataire,
        String habitationPrecision,
        LocalDate dateEnquete,
        DossierStatut statut, List<RetraiteAffiliationDto> affiliations,
        List<RetraiteMembreFamilleDto> famille, List<RetraiteMedicalDto> donneesMedicoSociales,
        List<RetraiteAssistanceDto> assistances, List<RetraiteBudgetDto> ressources,
        List<RetraiteBudgetDto> charges
) {}
