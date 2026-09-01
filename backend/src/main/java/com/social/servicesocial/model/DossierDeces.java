package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

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

    @PrePersist
    public void prePersist() {
        if (statut == null) {
            statut = StatutDossierDeces.EN_COURS;
        }
    }
}
