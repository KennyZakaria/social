package com.social.servicesocial.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ValidationDecesRequest(
        @Size(max = 2000, message = "Le commentaire ne doit pas depasser 2000 caracteres")
        String commentaire
) {}
