package com.social.servicesocial.controller;

import com.social.servicesocial.dto.*;
import com.social.servicesocial.service.ValidationDecesService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sections/DECES")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class ValidationDecesController {
    private final ValidationDecesService validationService;

    @GetMapping("/validation")
    public List<DossierDecesResponse> validation(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String statut) {
        return validationService.dossiersValidation(search, statut);
    }

    @GetMapping("/dossiers/{id}/controle-validation")
    public ValidationResultResponse controle(@PathVariable Long id) {
        return validationService.verifierDossier(id);
    }

    @PostMapping("/dossiers/{id}/soumettre-validation")
    public DossierValidationResponse soumettre(@PathVariable Long id, Principal principal) {
        return validationService.soumettreValidation(id, username(principal));
    }

    @PostMapping("/dossiers/{id}/valider")
    public DossierValidationResponse valider(
            @PathVariable Long id,
            @Valid @RequestBody ValidationDecesRequest request,
            Principal principal) {
        return validationService.valider(id, request, username(principal));
    }

    @PostMapping("/dossiers/{id}/retour-complement")
    public DossierDecesResponse retourComplement(
            @PathVariable Long id,
            @Valid @RequestBody RetourComplementRequest request,
            Principal principal) {
        return validationService.retourComplement(id, request, username(principal));
    }

    @PostMapping("/dossiers/{id}/rejeter")
    public DossierDecesResponse rejeter(
            @PathVariable Long id,
            @Valid @RequestBody RejetDecesRequest request,
            Principal principal) {
        return validationService.rejeter(id, request, username(principal));
    }

    @PostMapping("/dossiers/{id}/cloturer")
    public DossierDecesResponse cloturer(@PathVariable Long id, Principal principal) {
        return validationService.cloturer(id, username(principal));
    }

    @PostMapping("/dossiers/{id}/archiver")
    public DossierDecesResponse archiver(@PathVariable Long id, Principal principal) {
        return validationService.archiver(id, username(principal));
    }
    @GetMapping("/dossiers/{id}/historique")
    public List<HistoriqueDossierDecesResponse> historique(@PathVariable Long id) {
        return validationService.historique(id);
    }

    private String username(Principal principal) {
        return principal != null ? principal.getName() : "system";
    }
}
