package com.social.servicesocial.dto;

import java.time.LocalDateTime;

public record HistoriqueDossierDecesResponse(
        Long id,
        Long dossierId,
        String action,
        String ancienStatut,
        String nouveauStatut,
        String commentaire,
        String username,
        LocalDateTime dateAction
) {}
