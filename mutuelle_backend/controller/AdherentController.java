package mutuelle_backend.controller;

import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.AdherentPageResponse;
import mutuelle_backend.dto.AdherentRequest;
import mutuelle_backend.dto.AdherentResponse;
import mutuelle_backend.dto.AdherentStatistics;
import mutuelle_backend.service.AdherentService;

@RestController
@RequestMapping("/api/adherents")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('SECTION_SUPER_ADMIN')")
public class AdherentController {

    private final AdherentService service;


    // =====================================================
    // LIST + SEARCH + FILTER + PAGINATION
    // =====================================================

    @GetMapping
    public AdherentPageResponse list(

            @RequestParam(required = false)
            String search,

            @RequestParam(required = false)
            String categorie,

            @RequestParam(required = false)
            String situation,

            @PageableDefault(
                    size = 20,
                    sort = "id"
            )
            Pageable pageable

    ) {

        return service.list(
                search,
                categorie,
                situation,
                pageable
        );
    }


    // =====================================================
    // STATISTICS
    // =====================================================

    @GetMapping("/statistics")
    public AdherentStatistics statistics() {

        return service.statistics();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public AdherentResponse get(
            @PathVariable Long id
    ) {

        return service.get(id);
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public ResponseEntity<AdherentResponse> create(
            @Valid @RequestBody AdherentRequest request
    ) {

        AdherentResponse response =
                service.create(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public AdherentResponse update(

            @PathVariable Long id,

            @Valid @RequestBody AdherentRequest request

    ) {

        return service.update(id, request);
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long id
    ) {

        service.delete(id);
    }
}