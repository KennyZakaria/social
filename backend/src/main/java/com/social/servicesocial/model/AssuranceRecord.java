package com.social.servicesocial.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "assurance_records")
public class AssuranceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AssuranceRecordType type;

    @Column(nullable = false, unique = true, length = 40)
    private String numero;

    @Column(nullable = false)
    private Long adherentId;

    @Column(nullable = false, length = 160)
    private String nomComplet;

    @Column(length = 80)
    private String grade;

    @Column(length = 50)
    private String matricule;

    @Column(length = 30)
    private String cin;

    @Column(length = 50)
    private String matriculeBR;

    @Column(length = 140)
    private String uniteActuelle;

    @Column(length = 255)
    private String designation;

    @Column(length = 500)
    private String maladie;

    @Column(length = 100)
    private String codeMaladie;

    private LocalDate dateCommission;

    @Column(precision = 5, scale = 2)
    private BigDecimal tauxInvalidite;

    private Boolean imputable;

    private LocalDate dateDeces;

    @Column(length = 500)
    private String causeDeces;

    @Column(length = 120)
    private String referenceEnvoi;

    @Column(precision = 15, scale = 2)
    private BigDecimal peculeMontant;

    @Column(precision = 15, scale = 2)
    private BigDecimal decesMontant;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AssuranceRecordType getType() {
        return type;
    }

    public void setType(AssuranceRecordType type) {
        this.type = type;
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Long getAdherentId() {
        return adherentId;
    }

    public void setAdherentId(Long adherentId) {
        this.adherentId = adherentId;
    }

    public String getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getMatricule() {
        return matricule;
    }

    public void setMatricule(String matricule) {
        this.matricule = matricule;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getMatriculeBR() {
        return matriculeBR;
    }

    public void setMatriculeBR(String matriculeBR) {
        this.matriculeBR = matriculeBR;
    }

    public String getUniteActuelle() {
        return uniteActuelle;
    }

    public void setUniteActuelle(String uniteActuelle) {
        this.uniteActuelle = uniteActuelle;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}