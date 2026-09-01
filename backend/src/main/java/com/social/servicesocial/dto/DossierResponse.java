package com.social.servicesocial.dto;

import com.social.servicesocial.model.DossierStatut;
import com.social.servicesocial.model.SocialModule;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DossierResponse(
        Long id,
        SocialModule section,
        String numero,
        String adherentNom,
        String matricule,
        LocalDate dateEvenement,
        String lieu,
        String nature,
        String description,
        DossierStatut statut,
        LocalDateTime dateCreation,
        LocalDateTime dateMaj
) {}
