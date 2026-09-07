package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "dossiers_deces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierDeces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String numero;

    @Column(nullable = false)
    private Long adherentId;

    @Column(nullable = false, length = 150)
    private String nomComplet;

    @Column(nullable = false)
    private LocalDate dateDeces;

    @Column(nullable = false, length = 150)
    private String lieuDeces;

    @Column(length = 50)
    private String natureDeces;

    @Column(length = 255)
    private String causeDeces;

    @Column(length = 100)
    private String dpr;

    @Column(length = 2000)
    private String observation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatutDossierDeces statut;

    @Column(nullable = false)
    private LocalDateTime dateCreation;

    private LocalDateTime dateMaj;

    private LocalDateTime dateValidation;

    private LocalDateTime dateSoumissionValidation;

    private LocalDateTime dateRetourComplement;

    private LocalDateTime dateCloture;

    @Column(length = 120)
    private String soumisPar;

    @Column(length = 120)
    private String retournePar;

    @Column(length = 120)
    private String validePar;

    @Column(length = 120)
    private String cloturePar;

    @Column(length = 2000)
    private String motifDerniereDecision;

    @PrePersist
    public void prePersist() {
        if (statut == null) {
            statut = StatutDossierDeces.EN_COURS;
        }
        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }
        dateMaj = dateCreation;
    }

    @PreUpdate
    public void preUpdate() {
        dateMaj = LocalDateTime.now();
    }
}
