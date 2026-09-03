package com.social.servicesocial.model;
import jakarta.persistence.*;
import lombok.*;
@Entity
@Table(name="pieces_justificatives", uniqueConstraints=@UniqueConstraint(name="uk_piece_dossier_type", columnNames={"dossier_id","type_piece"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PieceJustificative {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="type_piece",nullable=false,length=60) private String typePiece;
 @Column(nullable=false,length=160) private String libelle;
 @Column(nullable=false) private boolean present;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="dossier_id",nullable=false) private DossierDeces dossier;
}
