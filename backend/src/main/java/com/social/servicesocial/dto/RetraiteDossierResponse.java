package com.social.servicesocial.dto;

import com.social.servicesocial.model.DossierStatut;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record RetraiteDossierResponse(
        Long id, String reference, Long adherentId, String nom, String prenom,
        String matricule, String cin, String matriculeBr, String grade, LocalDate dateNaissance, LocalDate dateRadiation,
        String motif, String telephoneGsm, String telephoneFixe, String affectation, String adresse,
        String situationFamiliale, String habitation, boolean proprietaire, boolean locataire, String habitationPrecision,
        LocalDate dateEnquete, DossierStatut statut, LocalDateTime dateCreation,
        LocalDateTime dateMaj, List<RetraiteAffiliationDto> affiliations,
        List<RetraiteMembreFamilleDto> famille, List<RetraiteMedicalDto> donneesMedicoSociales,
        List<RetraiteAssistanceDto> assistances, List<RetraiteBudgetDto> ressources,
        List<RetraiteBudgetDto> charges, List<RetraiteHistoriqueDto> historique
) {}
