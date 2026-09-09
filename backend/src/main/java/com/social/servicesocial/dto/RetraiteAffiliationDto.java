package com.social.servicesocial.dto;
import jakarta.validation.constraints.*;
public record RetraiteAffiliationDto(@NotBlank @Size(max=50) String typeCarte, boolean titulaire,
        @Size(max=80) String numeroCarte, @Size(max=500) String observation) {}
