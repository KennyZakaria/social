package mutuelle_backend.dto;

import java.time.LocalDate;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DossierDecesRequest {

    private Long adherentId;

    private LocalDate dateDeces;

    private String lieuDeces;

    private String natureDeces;

    private String causeDeces;

    private String dpr;

    private String observation;
}