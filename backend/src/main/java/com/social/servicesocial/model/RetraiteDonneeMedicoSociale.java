package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "retraite_donnees_medico_sociales")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetraiteDonneeMedicoSociale {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dossier_retraite_id", nullable = false) private DossierRetraite dossierRetraite;
    @Column(length = 255) private String identification;
    @Column(length = 1000) private String diagnostic;
    @Column(length = 100) private String duree;
}
