package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "retraite_affiliations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetraiteAffiliation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dossier_retraite_id", nullable = false) private DossierRetraite dossierRetraite;
    @Column(nullable = false, length = 50) private String typeCarte;
    private boolean titulaire;
    @Column(length = 80) private String numeroCarte;
    @Column(length = 500) private String observation;
}
