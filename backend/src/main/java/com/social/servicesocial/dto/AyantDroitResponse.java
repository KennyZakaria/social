package com.social.servicesocial.dto;

import java.time.LocalDate;

public record AyantDroitResponse(
        Long id,
        Long dossierId,
        String nom,
        String prenom,
        String cin,
        String lienParente,
        LocalDate dateNaissance,
        String telephone,
        String adresse,
        String typeRepartition,
        Double pourcentage
) {}
