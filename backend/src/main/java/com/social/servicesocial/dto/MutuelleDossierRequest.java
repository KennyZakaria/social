package com.social.servicesocial.dto;

import com.social.servicesocial.model.MutuelleCourrierType;
import com.social.servicesocial.model.MutuelleDossierType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class MutuelleDossierRequest {
    @NotNull
    private Long adherentId;
    @NotNull
    private MutuelleCourrierType typeCourrier;
    @NotBlank
    private String numeroOrdre;
    private String numeroEnvoi;
    private LocalDate dateEnvoi;
    private LocalDate dateReception;
    @NotBlank
    private String designation;
    @NotNull
    private MutuelleDossierType typeDossier;
    private String centreSoin;
    private String observation;

    public Long getAdherentId() { return adherentId; }
    public void setAdherentId(Long adherentId) { this.adherentId = adherentId; }
    public MutuelleCourrierType getTypeCourrier() { return typeCourrier; }
    public void setTypeCourrier(MutuelleCourrierType typeCourrier) { this.typeCourrier = typeCourrier; }
    public String getNumeroOrdre() { return numeroOrdre; }
    public void setNumeroOrdre(String numeroOrdre) { this.numeroOrdre = numeroOrdre; }
    public String getNumeroEnvoi() { return numeroEnvoi; }
    public void setNumeroEnvoi(String numeroEnvoi) { this.numeroEnvoi = numeroEnvoi; }
    public LocalDate getDateEnvoi() { return dateEnvoi; }
    public void setDateEnvoi(LocalDate dateEnvoi) { this.dateEnvoi = dateEnvoi; }
    public LocalDate getDateReception() { return dateReception; }
    public void setDateReception(LocalDate dateReception) { this.dateReception = dateReception; }
    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }
    public MutuelleDossierType getTypeDossier() { return typeDossier; }
    public void setTypeDossier(MutuelleDossierType typeDossier) { this.typeDossier = typeDossier; }
    public String getCentreSoin() { return centreSoin; }
    public void setCentreSoin(String centreSoin) { this.centreSoin = centreSoin; }
    public String getObservation() { return observation; }
    public void setObservation(String observation) { this.observation = observation; }
}
