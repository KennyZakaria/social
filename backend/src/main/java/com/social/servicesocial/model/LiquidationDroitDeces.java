package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "liquidations_droits_deces")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LiquidationDroitDeces {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "dossier_id", nullable = false) private DossierDeces dossier;
    @Column(nullable = false, length = 60) private String designation;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal montant;
    @Column(length = 160) private String beneficiaire;
    @Column(length = 120) private String reference;
}