package com.social.servicesocial.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RejetDecesRequest(
        @NotBlank(message = "Le motif de rejet est obligatoire")
        @Size(max = 2000, message = "Le motif ne doit pas depasser 2000 caracteres")
        String motif
) {}
