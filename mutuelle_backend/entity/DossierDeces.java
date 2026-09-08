package mutuelle_backend.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dossiers_deces")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierDeces {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 30)
    private String numero;

    @Column(nullable = false)
    private Long adherentId;

    @Column(nullable = false, length = 150)
    private String nomComplet;

    @Column(nullable = false)
    private LocalDate dateDeces;

    @Column(nullable = false, length = 150)
    private String lieuDeces;

    @Column(length = 50)
    private String natureDeces;

    @Column(length = 255)
    private String causeDeces;

    @Column(length = 100)
    private String dpr;

    @Column(length = 2000)
    private String observation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatutDossierDeces statut;

    @PrePersist
    public void prePersist() {

        if (statut == null) {
            statut = StatutDossierDeces.EN_COURS;
        }
    }
}