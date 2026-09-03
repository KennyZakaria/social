package com.social.servicesocial.controller;

import com.social.servicesocial.dto.AdherentPageResponse;
import com.social.servicesocial.dto.AdherentResponse;
import com.social.servicesocial.service.AdherentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deces/adherents")
@RequiredArgsConstructor
@PreAuthorize("@userAccessService.canAccessModule(authentication, 'DECES')")
public class DecesAdherentController {
    private final AdherentService adherentService;

    @GetMapping
    public AdherentPageResponse search(
            @RequestParam String search,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return adherentService.list(search, null, null, pageable);
    }
    @GetMapping("/{id}")
    public AdherentResponse get(@PathVariable Long id) {
        return adherentService.get(id);
    }
}