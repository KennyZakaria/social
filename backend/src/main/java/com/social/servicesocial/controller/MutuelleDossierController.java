package com.social.servicesocial.controller;

import com.social.servicesocial.dto.MutuelleDossierRequest;
import com.social.servicesocial.dto.MutuelleDossierResponse;
import com.social.servicesocial.model.MutuelleCourrierType;
import com.social.servicesocial.model.MutuelleDossierType;
import com.social.servicesocial.service.MutuelleDossierService;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/mutuelle/dossiers")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'MUTUELLE')")
public class MutuelleDossierController {

    private final MutuelleDossierService service;

    @GetMapping
    public ResponseEntity<List<MutuelleDossierResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) MutuelleCourrierType typeCourrier,
            @RequestParam(required = false) MutuelleDossierType typeDossier,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo) {
        return ResponseEntity.ok(service.list(search, typeCourrier, typeDossier, dateFrom, dateTo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MutuelleDossierResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<MutuelleDossierResponse> create(@Valid @RequestBody MutuelleDossierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MutuelleDossierResponse> update(@PathVariable Long id,
                                                           @Valid @RequestBody MutuelleDossierRequest request) {
        return ResponseEntity.ok(service.update(id, request));
    }
}
