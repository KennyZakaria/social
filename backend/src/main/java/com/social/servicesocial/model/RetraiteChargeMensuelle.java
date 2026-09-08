package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "retraite_charges_mensuelles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetraiteChargeMensuelle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dossier_retraite_id", nullable = false) private DossierRetraite dossierRetraite;
    @Column(nullable = false, length = 120) private String designation;
    @Column(precision = 12, scale = 2) private BigDecimal montant;
}
