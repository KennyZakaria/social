package com.social.servicesocial.dto;

import com.social.servicesocial.model.AssuranceRecordType;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record AssuranceRecordResponse(
        Long id,
        String numero,
        AssuranceRecordType type,
        Long adherentId,
        String nomComplet,
        String grade,
        String matricule,
        String cin,
        String matriculeBR,
        String uniteActuelle,
        String designation,
        String maladie,
        String codeMaladie,
        LocalDate dateCommission,
        BigDecimal tauxInvalidite,
        Boolean imputable,
        LocalDate dateDeces,
        String causeDeces,
        String referenceEnvoi,
        BigDecimal peculeMontant,
        BigDecimal decesMontant,
        LocalDateTime createdAt
) {}