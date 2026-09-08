package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dossiers_retraites")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DossierRetraite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id", nullable = false, unique = true)
    private Dossier dossier;

    private Long adherentId;
    @Column(nullable = false, length = 100) private String nom;
    @Column(nullable = false, length = 100) private String prenom;
    @Column(length = 50) private String cin;
    @Column(length = 50) private String matriculeBr;
    @Column(length = 80) private String grade;
    private LocalDate dateNaissance;
    private LocalDate dateRadiation;
    @Column(length = 255) private String motif;
    @Column(length = 50) private String telephoneGsm;
    @Column(length = 50) private String telephoneFixe;
    @Column(length = 150) private String affectation;
    @Column(length = 500) private String adresse;
    @Column(length = 80) private String situationFamiliale;
    @Column(length = 120) private String habitation;
    private boolean proprietaire;
    private boolean locataire;
    @Column(length = 500) private String habitationPrecision;
    private LocalDate dateEnquete;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 30)
    private DossierStatut statut;
    @Column(nullable = false, updatable = false) private LocalDateTime dateCreation;
    private LocalDateTime dateMaj;

    @PrePersist void onCreate() { if (statut == null) statut = DossierStatut.EN_COURS; dateCreation = LocalDateTime.now(); dateMaj = dateCreation; }
    @PreUpdate void onUpdate() { dateMaj = LocalDateTime.now(); }
}
