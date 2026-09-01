package mutuelle_backend.dto;
import jakarta.validation.constraints.*; import java.time.LocalDate;
public record AdherentRequest(
 @NotBlank @Size(max=100) String prenomAr, @NotBlank @Size(max=100) String nomAr,
 @NotBlank @Size(max=80) String categorie, @NotBlank @Size(max=80) String grade,
 @NotBlank @Size(max=50) String matriculeBR, @NotBlank @Size(max=50) String matricule,
 @NotNull @Past LocalDate dateNaissance, @NotBlank @Size(max=100) String lieuNaissance,
 LocalDate dateRadiation, @Size(max=255) String motifRadiation, LocalDate dateDeces, @Size(max=255) String causeDeces,
 @NotBlank @Size(max=120) String dernierUnite, @NotBlank @Size(max=120) String formationUnite,
 @NotBlank @Size(max=30) String telephone1, @Size(max=30) String telephone2,
 @NotBlank @Size(max=255) String adresse, @NotBlank @Email @Size(max=254) String email,
 @NotBlank @Size(max=80) String situationCategorie, boolean pension, @NotBlank @Size(max=30) String cin) {}
