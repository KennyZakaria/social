package com.social.servicesocial.controller;

import com.social.servicesocial.dto.AyantDroitRequest;
import com.social.servicesocial.dto.AyantDroitResponse;
import com.social.servicesocial.service.AyantDroitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deces/dossiers/{dossierId}/ayants-droit")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class AyantDroitController {

    private final AyantDroitService service;

    @GetMapping
    public List<AyantDroitResponse> list(@PathVariable Long dossierId) {
        return service.findByDossier(dossierId);
    }

    @PostMapping
    public ResponseEntity<AyantDroitResponse> create(
            @PathVariable Long dossierId,
            @RequestBody AyantDroitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dossierId, request));
    }

    @PutMapping("/{id}")
    public AyantDroitResponse update(
            @PathVariable Long dossierId,
            @PathVariable Long id,
            @RequestBody AyantDroitRequest request) {
        return service.update(dossierId, id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Long dossierId,
            @PathVariable Long id) {
        service.delete(dossierId, id);
        return ResponseEntity.noContent().build();
    }
}
