package mutuelle_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "ayant_droit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AyantDroit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(nullable = false, length = 100)
    private String prenom;

    @Column(nullable = false, length = 30)
    private String cin;

    @Column(nullable = false, length = 50)
    private String lienParente;

    private LocalDate dateNaissance;

    @Column(length = 30)
    private String telephone;

    @Column(length = 255)
    private String adresse;

    /*
     * Exemple :
     * POURCENTAGE
     * CHARIA
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TypeRepartition typeRepartition;

    /*
     * Pourcentage attribué à cet ayant droit.
     * Exemple : 50, 25, 25
     *
     * NULL si typeRepartition = CHARIA
     */
    private Double pourcentage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dossier_id", nullable = false)
    private DossierDeces dossier;
}