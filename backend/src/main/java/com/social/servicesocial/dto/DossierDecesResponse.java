package com.social.servicesocial.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Builder
@AllArgsConstructor
public class DossierDecesResponse {
    private Long id;
    private String numero;
    private Long adherentId;
    private String nomComplet;
    private String matricule;
    private LocalDate dateDeces;
    private String lieuDeces;
    private String natureDeces;
    private String causeDeces;
    private String dpr;
    private String observation;
    private String statut;
}
