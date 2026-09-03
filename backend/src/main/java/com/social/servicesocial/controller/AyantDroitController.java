package com.social.servicesocial.controller;

import com.social.servicesocial.dto.AyantDroitRequest;
import com.social.servicesocial.dto.AyantDroitResponse;
import com.social.servicesocial.service.AyantDroitService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/deces/adherents/{adherentId}/ayants-droit") @RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class AyantDroitController { private final AyantDroitService service;
 @GetMapping public List<AyantDroitResponse> list(@PathVariable Long adherentId){return service.findByAdherent(adherentId);}
 @PostMapping public ResponseEntity<AyantDroitResponse> create(@PathVariable Long adherentId,@RequestBody AyantDroitRequest request){return ResponseEntity.status(HttpStatus.CREATED).body(service.create(adherentId,request));}
 @PutMapping("/{id}") public AyantDroitResponse update(@PathVariable Long adherentId,@PathVariable Long id,@RequestBody AyantDroitRequest request){return service.update(adherentId,id,request);}
 @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long adherentId,@PathVariable Long id){service.delete(adherentId,id);return ResponseEntity.noContent().build();}}