package com.social.servicesocial.dto;
import java.time.LocalDate;
import jakarta.validation.constraints.*;
public record RetraiteMembreFamilleDto(String lieu, String mutuelle, String lieuTravail, LocalDate mariage,
        LocalDate divorce, String situationFamiliale, @NotBlank String lien,
        @NotBlank @Pattern(regexp="Conjoint|Enfant|Membre de famille") String type,
        @NotBlank @Size(max=100) String nom, @NotBlank @Size(max=100) String prenom,
        @NotNull @PastOrPresent LocalDate dateNaissance, @Size(max=50) String cin,
        @Size(max=120) String activite, @Size(max=120) String niveauInstruction,
        @Size(max=120) String emploi, boolean personneACharge) {}
