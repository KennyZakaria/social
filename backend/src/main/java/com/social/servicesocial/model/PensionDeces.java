package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "pensions_deces")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PensionDeces {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "dossier_id", nullable = false) private DossierDeces dossier;
    @Column(nullable = false, length = 30) private String typeBeneficiaire;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "ayant_droit_id") private AyantDroit ayantDroit;
    @Column(length = 100) private String numero;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal montant;
}