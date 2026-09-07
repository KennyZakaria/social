package com.social.servicesocial.controller;

import com.social.servicesocial.dto.FicheRenseignementsDecesRequest;
import com.social.servicesocial.dto.FicheRenseignementsDecesResponse;
import com.social.servicesocial.service.FicheRenseignementsDecesService;
import com.social.servicesocial.service.FicheRenseignementsPdfService;
import jakarta.validation.Valid;
import java.nio.charset.StandardCharsets;
import java.security.Principal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sections/DECES/dossiers/{id}/fiche")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class FicheRenseignementsDecesController {
    private final FicheRenseignementsDecesService ficheService;
    private final FicheRenseignementsPdfService pdfService;

    @GetMapping
    public FicheRenseignementsDecesResponse get(@PathVariable Long id) { return ficheService.get(id); }

    @PutMapping
    public FicheRenseignementsDecesResponse update(@PathVariable Long id, @Valid @RequestBody FicheRenseignementsDecesRequest request, Principal principal) {
        return ficheService.update(id, request, principal == null ? "system" : principal.getName());
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) {
        FicheRenseignementsDecesResponse fiche = ficheService.get(id);
        String filename = "fiche-deces-" + fiche.numeroDossier() + ".pdf";
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(filename, StandardCharsets.UTF_8).build().toString())
                .body(pdfService.export(id));
    }
}