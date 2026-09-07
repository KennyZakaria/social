package com.social.servicesocial.dto;

public record ValidationControleResponse(
        String code,
        String libelle,
        boolean complet,
        String message
) {}
