package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "retraite_membres_famille")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetraiteMembreFamille {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dossier_retraite_id", nullable = false) private DossierRetraite dossierRetraite;
    @Column(nullable = false, length = 30) private String type;
    @Column(nullable = false, length = 100) private String nom;
    @Column(nullable = false, length = 100) private String prenom;
    private LocalDate dateNaissance;
    @Column(length = 50) private String cin;
    @Column(length = 120) private String activite;
    @Column(length = 120) private String niveauInstruction;
    @Column(length = 120) private String emploi;
    private boolean personneACharge;
}
