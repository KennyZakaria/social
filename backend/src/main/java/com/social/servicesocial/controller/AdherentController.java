package com.social.servicesocial.controller;

import com.social.servicesocial.dto.AdherentPageResponse;
import com.social.servicesocial.dto.AdherentRequest;
import com.social.servicesocial.dto.AdherentResponse;
import com.social.servicesocial.dto.AdherentStatistics;
import com.social.servicesocial.service.AdherentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/adherents")
@RequiredArgsConstructor
public class AdherentController {

    private final AdherentService service;

    @GetMapping
    @PreAuthorize("hasAnyRole('MANAGER', 'AGENT')")
    public AdherentPageResponse list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String categorie,
            @RequestParam(required = false) String situation,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return service.list(search, categorie, situation, pageable);
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('MANAGER')")
    public AdherentStatistics statistics() {
        return service.statistics();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'AGENT')")
    public AdherentResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<AdherentResponse> create(@Valid @RequestBody AdherentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public AdherentResponse update(@PathVariable Long id, @Valid @RequestBody AdherentRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
