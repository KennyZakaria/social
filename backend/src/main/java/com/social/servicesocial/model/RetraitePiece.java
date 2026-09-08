package com.social.servicesocial.model;
import jakarta.persistence.*;
import lombok.*;
@Embeddable @Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class RetraitePiece {
    private Integer quantite;
    private String type;
    private String nom;
    private String mime;
    @Lob private String contenu;
}
