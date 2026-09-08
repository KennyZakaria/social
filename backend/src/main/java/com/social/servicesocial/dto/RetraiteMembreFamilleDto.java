package com.social.servicesocial.dto;
import java.time.LocalDate;
public record RetraiteMembreFamilleDto(String lieu, String mutuelle, String lieuTravail, LocalDate mariage, LocalDate divorce, String situationFamiliale, String lien, String type, String nom, String prenom, LocalDate dateNaissance, String cin, String activite, String niveauInstruction, String emploi, boolean personneACharge) {}
