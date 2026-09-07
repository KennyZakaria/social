package mutuelle_backend.dto;
import java.time.LocalDate;
public record AdherentResponse(Long id, String prenomAr, String nomAr, String categorie, String grade, String matriculeBR, String matricule, LocalDate dateNaissance, String lieuNaissance, LocalDate dateRadiation, String motifRadiation, LocalDate dateDeces, String causeDeces, String dernierUnite, String formationUnite, String telephone1, String telephone2, String adresse, String email, String situationCategorie, boolean pension, String cin) {}
