package mutuelle_backend.dto;

import mutuelle_backend.entity.DossierStatut;
import mutuelle_backend.entity.Section;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record DossierResponse(
    Long id,
    Section section,
    String numero,
    String adherentNom,
    String matricule,
    LocalDate dateEvenement,
    String lieu,
    String nature,
    String description,
    DossierStatut statut,
    LocalDateTime dateCreation,
    LocalDateTime dateMaj
) {}
