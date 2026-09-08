package com.social.servicesocial.dto;
import jakarta.validation.constraints.*;
public record RetraitePieceDto(@Min(1) Integer quantite, @NotBlank @Size(max=100) String type,
 @Size(max=255) String nom, @Pattern(regexp="application/pdf|image/jpeg|image/png|^$") String mime,
 @Size(max=2796204) String contenu) {}
