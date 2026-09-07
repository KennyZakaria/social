package com.social.servicesocial.controller;

import com.social.servicesocial.dto.DossierRequest;
import com.social.servicesocial.dto.DossierResponse;
import com.social.servicesocial.model.DossierStatut;
import com.social.servicesocial.model.SocialModule;
import com.social.servicesocial.service.DossierService;
import com.social.servicesocial.service.UserAccessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sections/{section}/dossiers")
@RequiredArgsConstructor
public class DossierController {

    private final DossierService service;

    @GetMapping
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #section.name())")
    public Page<DossierResponse> list(
            @PathVariable SocialModule section,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) DossierStatut statut,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        return service.list(section, search, statut, pageable);
    }

    @GetMapping("/{id}")
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #section.name())")
    public DossierResponse get(@PathVariable SocialModule section, @PathVariable Long id) {
        return service.get(section, id);
    }

    @PostMapping
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #section.name())")
    public ResponseEntity<DossierResponse> create(
            @PathVariable SocialModule section,
            @Valid @RequestBody DossierRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(section, request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #section.name())")
    public DossierResponse update(
            @PathVariable SocialModule section,
            @PathVariable Long id,
            @Valid @RequestBody DossierRequest request) {
        return service.update(section, id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("@userAccessService.canAccessModule(authentication, #section.name())")
    public void delete(@PathVariable SocialModule section, @PathVariable Long id) {
        service.delete(section, id);
    }
}
