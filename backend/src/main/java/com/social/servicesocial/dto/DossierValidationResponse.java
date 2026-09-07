package com.social.servicesocial.dto;

public record DossierValidationResponse(
        DossierDecesResponse dossier,
        ValidationResultResponse controle
) {}
