package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;

@Entity
@Table(name = "dossier_deces_historique")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierDecesHistorique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long dossierId;

    @Column(nullable = false, length = 80)
    private String action;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private StatutDossierDeces ancienStatut;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    private StatutDossierDeces nouveauStatut;

    @Column(length = 2000)
    private String commentaire;

    @Column(length = 120)
    private String username;

    @Column(nullable = false)
    private LocalDateTime dateAction;

    @PrePersist
    public void prePersist() {
        if (dateAction == null) {
            dateAction = LocalDateTime.now();
        }
    }
}
