package com.social.servicesocial.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "retraite_historiques")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RetraiteHistorique {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "dossier_retraite_id", nullable = false) private DossierRetraite dossierRetraite;
    @Column(nullable = false, length = 255) private String action;
    @Column(length = 1000) private String detail;
    @Column(nullable = false) private LocalDateTime dateAction;
    @PrePersist void onCreate() { if (dateAction == null) dateAction = LocalDateTime.now(); }
}
