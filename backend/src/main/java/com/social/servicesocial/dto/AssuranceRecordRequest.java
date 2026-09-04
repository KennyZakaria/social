package com.social.servicesocial.dto;

import com.social.servicesocial.model.AssuranceRecordType;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public class AssuranceRecordRequest {
    @NotNull
    private AssuranceRecordType type;
    @NotNull
    private Long adherentId;
    private String designation;
    private String maladie;
    private String codeMaladie;
    private LocalDate dateCommission;
    private BigDecimal tauxInvalidite;
    private Boolean imputable;
    private LocalDate dateDeces;
    private String causeDeces;
    private String referenceEnvoi;
    private BigDecimal peculeMontant;
    private BigDecimal decesMontant;

    public AssuranceRecordType getType() {
        return type;
    }

    public void setType(AssuranceRecordType type) {
        this.type = type;
    }

    public Long getAdherentId() {
        return adherentId;
    }

    public void setAdherentId(Long adherentId) {
        this.adherentId = adherentId;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public String getMaladie() {
        return maladie;
    }

    public void setMaladie(String maladie) {
        this.maladie = maladie;
    }

    public String getCodeMaladie() {
        return codeMaladie;
    }

    public void setCodeMaladie(String codeMaladie) {
        this.codeMaladie = codeMaladie;
    }

    public LocalDate getDateCommission() {
        return dateCommission;
    }

    public void setDateCommission(LocalDate dateCommission) {
        this.dateCommission = dateCommission;
    }

    public BigDecimal getTauxInvalidite() {
        return tauxInvalidite;
    }

    public void setTauxInvalidite(BigDecimal tauxInvalidite) {
        this.tauxInvalidite = tauxInvalidite;
    }

    public Boolean getImputable() {
        return imputable;
    }

    public void setImputable(Boolean imputable) {
        this.imputable = imputable;
    }

    public LocalDate getDateDeces() {
        return dateDeces;
    }

    public void setDateDeces(LocalDate dateDeces) {
        this.dateDeces = dateDeces;
    }

    public String getCauseDeces() {
        return causeDeces;
    }

    public void setCauseDeces(String causeDeces) {
        this.causeDeces = causeDeces;
    }

    public String getReferenceEnvoi() {
        return referenceEnvoi;
    }

    public void setReferenceEnvoi(String referenceEnvoi) {
        this.referenceEnvoi = referenceEnvoi;
    }

    public BigDecimal getPeculeMontant() {
        return peculeMontant;
    }

    public void setPeculeMontant(BigDecimal peculeMontant) {
        this.peculeMontant = peculeMontant;
    }

    public BigDecimal getDecesMontant() {
        return decesMontant;
    }

    public void setDecesMontant(BigDecimal decesMontant) {
        this.decesMontant = decesMontant;
    }
}