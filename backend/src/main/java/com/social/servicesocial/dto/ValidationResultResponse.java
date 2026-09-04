package com.social.servicesocial.dto;

import java.util.List;
import java.util.Map;

public record ValidationResultResponse(
        boolean valid,
        int progression,
        List<String> erreurs,
        List<String> avertissements,
        Map<String, Boolean> controles,
        List<ValidationControleResponse> details
) {}
