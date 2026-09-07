package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "assistances_octroyees_deces")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AssistanceOctroyeeDeces {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "dossier_id", nullable = false) private DossierDeces dossier;
    @Column(nullable = false, length = 40) private String designation;
    @Column(nullable = false, precision = 19, scale = 2) private BigDecimal montant;
    private LocalDate date;
    @Column(length = 120) private String chequeReference;
}