package com.social.servicesocial.service;

import com.social.servicesocial.dto.AyantDroitRequest;
import com.social.servicesocial.dto.AyantDroitResponse;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.model.AyantDroit;
import com.social.servicesocial.repository.AdherentRepository;
import com.social.servicesocial.repository.AyantDroitRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class AyantDroitService {
 private final AyantDroitRepository repository; private final AdherentRepository adherentRepository;
 @Transactional(readOnly=true) public List<AyantDroitResponse> findByAdherent(Long adherentId){ requireAdherent(adherentId); return repository.findByAdherentIdOrderByIdAsc(adherentId).stream().map(this::toResponse).toList(); }
 @Transactional public AyantDroitResponse create(Long adherentId, AyantDroitRequest request){ AyantDroit item=new AyantDroit(); map(request,item); item.setAdherent(requireAdherent(adherentId)); return toResponse(repository.save(item)); }
 @Transactional public AyantDroitResponse update(Long adherentId, Long id, AyantDroitRequest request){ AyantDroit item=repository.findByIdAndAdherentId(id,adherentId).orElseThrow(()->new NotFoundException("Ayant droit introuvable : "+id)); map(request,item); return toResponse(repository.save(item)); }
 @Transactional public void delete(Long adherentId,Long id){ repository.delete(repository.findByIdAndAdherentId(id,adherentId).orElseThrow(()->new NotFoundException("Ayant droit introuvable : "+id))); }
 private Adherent requireAdherent(Long id){return adherentRepository.findById(id).orElseThrow(()->new NotFoundException("Adhérent introuvable : "+id));}
 private void map(AyantDroitRequest r,AyantDroit e){e.setNom(r.nom());e.setPrenom(r.prenom());e.setCin(r.cin());e.setLienParente(r.lienParente());e.setDateNaissance(r.dateNaissance());e.setTelephone(r.telephone());e.setAdresse(r.adresse());e.setTypeRepartition(r.typeRepartition());e.setPourcentage(r.pourcentage());}
 private AyantDroitResponse toResponse(AyantDroit e){return new AyantDroitResponse(e.getId(),e.getAdherent().getId(),e.getNom(),e.getPrenom(),e.getCin(),e.getLienParente(),e.getDateNaissance(),e.getTelephone(),e.getAdresse(),e.getTypeRepartition().name(),e.getPourcentage());}
}