package com.social.servicesocial.controller;

import com.social.servicesocial.dto.DemandeDecesRequest;
import com.social.servicesocial.dto.DemandeDecesResponse;
import com.social.servicesocial.service.DemandeDecesService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/deces/dossiers/{dossierId}/demandes")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class DemandeDecesController {
    private final DemandeDecesService service;
    @GetMapping public List<DemandeDecesResponse> list(@PathVariable Long dossierId) { return service.list(dossierId); }
    @PostMapping public ResponseEntity<DemandeDecesResponse> create(@PathVariable Long dossierId, @RequestBody DemandeDecesRequest request) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dossierId, request)); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> delete(@PathVariable Long dossierId, @PathVariable Long id) { service.delete(dossierId, id); return ResponseEntity.noContent().build(); }
    @PatchMapping("/{id}/statut") public DemandeDecesResponse updateStatut(@PathVariable Long dossierId, @PathVariable Long id, @RequestParam String statut) { return service.updateStatut(dossierId, id, statut); }
}