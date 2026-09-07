package com.social.servicesocial.service;
import com.social.servicesocial.dto.*;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.*;
import com.social.servicesocial.repository.*;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class PieceJustificativeService {
 private final PieceJustificativeRepository pieceRepository; private final DossierDecesRepository dossierRepository;
 @Transactional(readOnly=true) public List<PieceJustificativeResponse> list(Long dossierId){requireDossier(dossierId);return pieceRepository.findByDossierIdOrderByTypePieceAsc(dossierId).stream().map(this::toResponse).toList();}
 @Transactional public PieceJustificativeResponse save(Long dossierId,String typePiece,PieceJustificativeRequest request){
  if(typePiece==null||!typePiece.matches("[A-Z0-9_]{2,60}"))throw new IllegalArgumentException("Type de piece invalide.");
  if(request.libelle()==null||request.libelle().isBlank())throw new IllegalArgumentException("Le libelle est obligatoire.");
  DossierDeces dossier=requireDossier(dossierId);
  PieceJustificative piece=pieceRepository.findByDossierIdAndTypePiece(dossierId,typePiece).orElseGet(()->PieceJustificative.builder().dossier(dossier).typePiece(typePiece).build());
  piece.setLibelle(request.libelle().trim());piece.setPresent(request.present());return toResponse(pieceRepository.save(piece));
 }
 private DossierDeces requireDossier(Long id){return dossierRepository.findById(id).orElseThrow(()->new NotFoundException("Dossier deces introuvable : "+id));}
 private PieceJustificativeResponse toResponse(PieceJustificative p){return new PieceJustificativeResponse(p.getId(),p.getDossier().getId(),p.getTypePiece(),p.getLibelle(),p.isPresent());}
}
