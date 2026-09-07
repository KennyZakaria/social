package com.social.servicesocial.dto;

import com.social.servicesocial.model.DossierStatut;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record RetraiteDossierResponse(
        Long id, String reference, Long adherentId, String nom, String prenom,
        String matricule, String cin, String grade, LocalDate dateRadiation,
        String situationFamiliale, DossierStatut statut, LocalDateTime dateCreation,
        LocalDateTime dateMaj
) {}
