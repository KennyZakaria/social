package mutuelle_backend.dto;

import jakarta.validation.constraints.*;
import mutuelle_backend.entity.DossierStatut;
import java.time.LocalDate;

public record DossierRequest(
    @NotBlank @Size(max = 40) String numero,
    @NotBlank @Size(max = 150) String adherentNom,
    @NotBlank @Size(max = 50) String matricule,
    LocalDate dateEvenement,
    @Size(max = 120) String lieu,
    @Size(max = 120) String nature,
    @Size(max = 1000) String description,
    @NotNull DossierStatut statut
) {}
