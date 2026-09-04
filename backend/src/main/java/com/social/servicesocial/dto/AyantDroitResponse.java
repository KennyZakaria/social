package com.social.servicesocial.dto;

import java.time.LocalDate;

public record AyantDroitResponse(
        Long id, Long adherentId, String nom, String prenom, String cin, String lienParente,
        LocalDate dateNaissance, String lieuNaissance, String situationFamiliale,
        String niveauInstruction, String activiteEmploi, String telephone, String adresse,
        String typeRepartition, Double pourcentage
) {}