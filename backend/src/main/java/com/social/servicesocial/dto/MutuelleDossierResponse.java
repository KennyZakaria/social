package com.social.servicesocial.dto;

import com.social.servicesocial.model.MutuelleCourrierType;
import com.social.servicesocial.model.MutuelleDossierType;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MutuelleDossierResponse(
        Long id,
        String numeroDossier,
        Long adherentId,
        String nomComplet,
        String grade,
        String matricule,
        String cin,
        String matriculeBR,
        String uniteActuelle,
        MutuelleCourrierType typeCourrier,
        String numeroOrdre,
        String numeroEnvoi,
        LocalDate dateEnvoi,
        LocalDate dateReception,
        String designation,
        MutuelleDossierType typeDossier,
        String centreSoin,
        String observation,
        LocalDateTime createdAt
) {}
