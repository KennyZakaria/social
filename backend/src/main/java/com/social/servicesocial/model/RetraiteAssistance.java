package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "retraite_assistances")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetraiteAssistance {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dossier_retraite_id", nullable = false) private DossierRetraite dossierRetraite;
    @Column(length = 255) private String nature;
    @Column(length = 255) private String organisme;
    private LocalDate dateAssistance;
    @Column(length = 1000) private String observation;
}
