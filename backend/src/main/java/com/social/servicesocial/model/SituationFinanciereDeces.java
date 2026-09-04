package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.*;

@Entity
@Table(name = "situations_financieres_deces", uniqueConstraints = @UniqueConstraint(columnNames = "dossier_id"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SituationFinanciereDeces {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @OneToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "dossier_id", nullable = false, unique = true) private DossierDeces dossier;
    @Column(precision = 19, scale = 2) private BigDecimal pmr;
    @Column(precision = 19, scale = 2) private BigDecimal pmi;
    @Column(precision = 19, scale = 2) private BigDecimal salaire;
    @Column(precision = 19, scale = 2) private BigDecimal autresRessources;
    @Column(precision = 19, scale = 2) private BigDecimal eauElectricite;
    @Column(precision = 19, scale = 2) private BigDecimal fraisMedicaux;
    @Column(precision = 19, scale = 2) private BigDecimal fraisScolarite;
    @Column(precision = 19, scale = 2) private BigDecimal loyer;
    @Column(precision = 19, scale = 2) private BigDecimal autresCharges;
}