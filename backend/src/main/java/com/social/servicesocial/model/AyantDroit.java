package com.social.servicesocial.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import lombok.*;

@Entity
@Table(name = "ayant_droit")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AyantDroit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false, length = 100) private String nom;
    @Column(nullable = false, length = 100) private String prenom;
    @Column(nullable = false, length = 30) private String cin;
    @Column(nullable = false, length = 50) private String lienParente;
    private LocalDate dateNaissance;
    @Column(length = 30) private String telephone;
    @Column(length = 255) private String adresse;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private TypeRepartition typeRepartition;
    private Double pourcentage;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "adherent_id", nullable = false) private Adherent adherent;
}