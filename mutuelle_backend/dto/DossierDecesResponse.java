package mutuelle_backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class DossierDecesResponse {

    private Long id;

    private String numero;

    private Long adherentId;

    private String nomComplet;

    private LocalDate dateDeces;

    private String lieuDeces;

    private String natureDeces;

    private String causeDeces;

    private String dpr;

    private String observation;

    private String statut;
}