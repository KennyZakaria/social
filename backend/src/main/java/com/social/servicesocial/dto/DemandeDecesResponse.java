package com.social.servicesocial.dto;

import java.time.LocalDateTime;

public record DemandeDecesResponse(Long id, Long dossierId, String typeDemande, String description, String statut, LocalDateTime dateDemande, LocalDateTime dateTraitement) {}