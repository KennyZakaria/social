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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "mutuelle_dossiers")
public class MutuelleDossier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String numeroDossier;

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

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MutuelleCourrierType typeCourrier;

    @Column(nullable = false, length = 40)
    private String numeroOrdre;

    @Column(length = 40)
    private String numeroEnvoi;

    private LocalDate dateEnvoi;

    private LocalDate dateReception;

    @Column(length = 500)
    private String designation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MutuelleDossierType typeDossier;

    @Column(length = 120)
    private String centreSoin;

    @Column(length = 500)
    private String observation;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNumeroDossier() { return numeroDossier; }
    public void setNumeroDossier(String numeroDossier) { this.numeroDossier = numeroDossier; }
    public Long getAdherentId() { return adherentId; }
    public void setAdherentId(Long adherentId) { this.adherentId = adherentId; }
    public String getNomComplet() { return nomComplet; }
    public void setNomComplet(String nomComplet) { this.nomComplet = nomComplet; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public String getMatricule() { return matricule; }
    public void setMatricule(String matricule) { this.matricule = matricule; }
    public String getCin() { return cin; }
    public void setCin(String cin) { this.cin = cin; }
    public String getMatriculeBR() { return matriculeBR; }
    public void setMatriculeBR(String matriculeBR) { this.matriculeBR = matriculeBR; }
    public String getUniteActuelle() { return uniteActuelle; }
    public void setUniteActuelle(String uniteActuelle) { this.uniteActuelle = uniteActuelle; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
