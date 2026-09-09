package com.social.servicesocial.dto;
import jakarta.validation.constraints.*;
public record RetraiteMedicalDto(@NotBlank @Size(max=255) String identification,
        @NotBlank @Size(max=1000) String diagnostic, @Size(max=100) String duree) {}
