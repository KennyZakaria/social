package com.social.servicesocial.dto;
import java.time.LocalDate;
public record RetraiteMembreFamilleDto(String type, String nom, String prenom, LocalDate dateNaissance, String cin, String activite, String niveauInstruction, String emploi, boolean personneACharge) {}
