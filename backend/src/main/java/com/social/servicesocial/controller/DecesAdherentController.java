package com.social.servicesocial.controller;

import com.social.servicesocial.dto.AdherentPageResponse;
import com.social.servicesocial.dto.AdherentResponse;
import com.social.servicesocial.dto.DecesAdherentPageResponse;
import com.social.servicesocial.dto.DecesAdherentResponse;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.model.DossierDeces;
import com.social.servicesocial.repository.AdherentRepository;
import com.social.servicesocial.repository.DossierDecesRepository;
import com.social.servicesocial.service.AdherentService;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
    private final AdherentRepository adherentRepository;
    private final DossierDecesRepository dossierDecesRepository;

    @GetMapping
    public AdherentPageResponse search(
            @RequestParam String search,
            @PageableDefault(size = 10, sort = "id") Pageable pageable) {
        return adherentService.list(search, null, null, pageable);
    }

    @GetMapping("/dossiers-status")
    public DecesAdherentPageResponse listWithDossierStatus(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Boolean hasDossierDeces,
            @PageableDefault(size = 15, sort = "id") Pageable pageable) {

        if (hasDossierDeces == null) {
            return toPageResponse(pageWithDossierStatus(adherentRepository.findAll(spec(search), pageable)));
        }

        List<Adherent> filtered = adherentRepository.findAll(spec(search)).stream()
                .filter(adherent -> dossierDecesRepository.existsByAdherentId(adherent.getId()) == hasDossierDeces)
                .toList();

        int start = Math.min((int) pageable.getOffset(), filtered.size());
        int end = Math.min(start + pageable.getPageSize(), filtered.size());
        Page<Adherent> page = new PageImpl<>(filtered.subList(start, end), pageable, filtered.size());
        return toPageResponse(pageWithDossierStatus(page));
    }

    @GetMapping("/{id}")
    public AdherentResponse get(@PathVariable Long id) {
        return adherentService.get(id);
    }

    private Page<DecesAdherentResponse> pageWithDossierStatus(Page<Adherent> page) {
        List<Long> adherentIds = page.getContent().stream().map(Adherent::getId).toList();
        Map<Long, DossierDeces> dossiersByAdherent = dossierDecesRepository.findByAdherentIdIn(adherentIds)
                .stream()
                .collect(Collectors.toMap(DossierDeces::getAdherentId, Function.identity(), (first, second) -> first));

        List<DecesAdherentResponse> content = page.getContent().stream()
                .map(adherent -> toDecesResponse(adherent, dossiersByAdherent.get(adherent.getId())))
                .toList();

        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
    }

    private DecesAdherentPageResponse toPageResponse(Page<DecesAdherentResponse> page) {
        return new DecesAdherentPageResponse(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isFirst(),
                page.isLast(),
                page.isEmpty()
        );
    }

    private Specification<Adherent> spec(String search) {
        Specification<Adherent> spec = (root, query, cb) -> cb.conjunction();

        if (search != null && !search.isBlank()) {
            String value = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("nomAr")), value),
                    cb.like(cb.lower(root.get("prenomAr")), value),
                    cb.like(cb.lower(root.get("matricule")), value),
                    cb.like(cb.lower(root.get("matriculeBR")), value),
                    cb.like(cb.lower(root.get("cin")), value)
            ));
        }

        return spec;
    }

    private DecesAdherentResponse toDecesResponse(Adherent adherent, DossierDeces dossier) {
        return new DecesAdherentResponse(
                adherent.getId(),
                adherent.getMatricule(),
                adherent.getMatriculeBR(),
                adherent.getCin(),
                adherent.getNomAr(),
                adherent.getPrenomAr(),
                adherent.getCategorie(),
                adherent.getGrade(),
                adherent.getSituationCategorie(),
                dossier != null,
                dossier == null ? null : dossier.getId(),
                dossier == null ? null : dossier.getNumero(),
                dossier == null ? null : dossier.getStatut().name()
        );
    }
}