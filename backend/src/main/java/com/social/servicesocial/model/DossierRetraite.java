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

    private String nomAr;
    private String prenomAr;
    private String lieuNaissance;
    private String matriculeCorps;
    private String categorie;
    private String situationCategorie;
    private Boolean pension;
    private LocalDate dateEntreeService;
    private String motifRadiationSanction;
    private LocalDate dateDeces;
    private String causeDeces;
    private String natureDeces;
    private String formationUnite;
    private String derniereRegion;
    private String telephoneGsm2;
    private String email;
    private String observation;
    private String adresseEM;
    private String code;
    private String carteFondation;
    private String numeroPmr;
    private String montantPmr;
    private String numeroPmi;
    private String montantPmi;
    private String professionActuelle;
    private String colisRamadan;
    private String regionResidence;
    private String situationLogement;
    private String hayRabat;
    private String observationSociale;
    private String cinSocial;
    private String matriculeSocial;
    private String motifEnquete;
    private String numeroDossier;
    private String cartePrelevementCmr;
    private String situationFraternelle;
    private String anneeAdhesion;
    private String modeReglement;
    private String numeroRecu;
    private String datePaiement;
    private String observationAdhesion;
    private Boolean avecPhoto;
    @ElementCollection
    @CollectionTable(name="retraite_pieces", joinColumns=@JoinColumn(name="dossier_retraite_id"))
    private java.util.List<RetraitePiece> pieces = new java.util.ArrayList<>();
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
