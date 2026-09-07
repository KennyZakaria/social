package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "ayants_droit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AyantDroit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(nullable = false, length = 30)
    private String cin;

    @Column(nullable = false, length = 50)
    private String lienParente;

    private LocalDate dateNaissance;

    @Column(length = 30)
    private String telephone;

    @Column(length = 255)
    private String adresse;

    /**
     * POURCENTAGE: distribution par pourcentage explicite.
     * CHARIA: distribution selon les règles islamiques (pourcentage = null).
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeRepartition typeRepartition;

    /** Null when typeRepartition = CHARIA. */
    private Double pourcentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id", nullable = false)
    private DossierDeces dossier;
}
