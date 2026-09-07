package com.social.servicesocial.dto;

public record DecesAdherentResponse(
        Long id,
        String matricule,
        String matriculeBR,
        String cin,
        String nomAr,
        String prenomAr,
        String categorie,
        String grade,
        String situationCategorie,
        boolean hasDossierDeces,
        Long dossierDecesId,
        String numeroDossierDeces,
        String statutDossierDeces
) {}