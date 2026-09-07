package com.social.servicesocial.controller;

import com.social.servicesocial.dto.RetraiteDossierRequest;
import com.social.servicesocial.dto.RetraiteDossierResponse;
import com.social.servicesocial.service.RetraiteDossierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/retraites")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'RETRAITES')")
public class RetraiteDossierController {
    private final RetraiteDossierService service;

    @GetMapping public List<RetraiteDossierResponse> list() { return service.list(); }
    @GetMapping("/{id}") public RetraiteDossierResponse get(@PathVariable Long id) { return service.get(id); }
    @PostMapping public ResponseEntity<RetraiteDossierResponse> create(@Valid @RequestBody RetraiteDossierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }
    @PutMapping("/{id}") public RetraiteDossierResponse update(@PathVariable Long id, @Valid @RequestBody RetraiteDossierRequest request) { return service.update(id, request); }
    @PostMapping("/{id}/close") public RetraiteDossierResponse close(@PathVariable Long id) { return service.close(id); }
}
