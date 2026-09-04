package com.social.servicesocial.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private String matricule;
    private String matriculeBR;
    private String cin;
    private LocalDate dateDeces;
    private String lieuDeces;
    private String natureDeces;
    private String causeDeces;
    private String dpr;
    private String observation;
    private String statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateMaj;
    private LocalDateTime dateValidation;
    private LocalDateTime dateSoumissionValidation;
    private LocalDateTime dateRetourComplement;
    private LocalDateTime dateCloture;
    private String soumisPar;
    private String retournePar;
    private String validePar;
    private String cloturePar;
    private String motifDerniereDecision;
}
