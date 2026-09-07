package mutuelle_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity @Table(name = "adherents", uniqueConstraints = { @UniqueConstraint(columnNames = "matricule"), @UniqueConstraint(columnNames = "cin") })
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Adherent {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
  @Column(nullable = false, length = 100) private String prenomAr;
  @Column(nullable = false, length = 100) private String nomAr;
  @Column(nullable = false, length = 80) private String categorie;
  @Column(nullable = false, length = 80) private String grade;
  @Column(nullable = false, length = 50) private String matriculeBR;
  @Column(nullable = false, length = 50) private String matricule;
  @Column(nullable = false) private LocalDate dateNaissance;
  @Column(nullable = false, length = 100) private String lieuNaissance;
  private LocalDate dateRadiation;
  @Column(length = 255) private String motifRadiation;
  private LocalDate dateDeces;
  @Column(length = 255) private String causeDeces;
  @Column(nullable = false, length = 120) private String dernierUnite;
  @Column(nullable = false, length = 120) private String formationUnite;
  @Column(nullable = false, length = 30) private String telephone1;
  @Column(length = 30) private String telephone2;
  @Column(nullable = false, length = 255) private String adresse;
  @Column(nullable = false, length = 254) private String email;
  @Column(nullable = false, length = 80) private String situationCategorie;
  @Column(nullable = false) private boolean pension;
  @Column(nullable = false, length = 30) private String cin;
}
