package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Generic dossier linked to a SocialModule section.
 * URL pattern: /api/sections/{section}/dossiers
 */
@Entity
@Table(name = "dossiers",
        uniqueConstraints = @UniqueConstraint(columnNames = "numero"))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dossier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Maps to a SocialModule (MUTUELLE, RETRAITES, etc.) */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SocialModule section;

    @Column(nullable = false, unique = true, length = 40)
    private String numero;

    @Column(nullable = false, length = 150)
    private String adherentNom;

    @Column(nullable = false, length = 50)
    private String matricule;

    private LocalDate dateEvenement;

    @Column(length = 120)
    private String lieu;

    @Column(length = 120)
    private String nature;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DossierStatut statut;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateMaj;

    @PrePersist
    void onCreate() {
        dateCreation = LocalDateTime.now();
        dateMaj = dateCreation;
    }

    @PreUpdate
    void onUpdate() {
        dateMaj = LocalDateTime.now();
    }
}
