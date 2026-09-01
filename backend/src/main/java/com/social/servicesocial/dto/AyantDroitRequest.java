package com.social.servicesocial.dto;

import com.social.servicesocial.model.TypeRepartition;
import java.time.LocalDate;

public record AyantDroitRequest(
        String nom,
        String prenom,
        String cin,
        String lienParente,
        LocalDate dateNaissance,
        String telephone,
        String adresse,
        TypeRepartition typeRepartition,
        Double pourcentage
) {}
