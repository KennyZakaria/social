package com.social.servicesocial.controller;

import com.social.servicesocial.dto.DossierDecesRequest;
import com.social.servicesocial.dto.DossierDecesResponse;
import com.social.servicesocial.service.DossierDecesService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deces/dossiers")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class DossierDecesController {

    private final DossierDecesService service;

    @PostMapping
    public ResponseEntity<DossierDecesResponse> create(@Valid @RequestBody DossierDecesRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @GetMapping
    public ResponseEntity<List<DossierDecesResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DossierDecesResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}/statut")
    public ResponseEntity<DossierDecesResponse> updateStatut(
            @PathVariable Long id,
            @RequestParam String statut) {
        return ResponseEntity.ok(service.updateStatut(id, statut));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
