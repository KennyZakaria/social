package com.social.servicesocial.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RetourComplementRequest(
        @NotBlank(message = "Le motif de retour pour complement est obligatoire")
        @Size(max = 2000, message = "Le motif ne doit pas depasser 2000 caracteres")
        String motif
) {}
