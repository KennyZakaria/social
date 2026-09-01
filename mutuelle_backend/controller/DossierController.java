package mutuelle_backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.*;
import mutuelle_backend.entity.DossierStatut;
import mutuelle_backend.entity.Section;
import mutuelle_backend.service.DossierService;
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
@PreAuthorize("hasAuthority('SECTION_' + #section.name()) or hasAuthority('SECTION_SUPER_ADMIN')")
public class DossierController {

  private final DossierService service;

  @GetMapping
  public Page<DossierResponse> list(
      @PathVariable Section section,
      @RequestParam(required = false) String search,
      @RequestParam(required = false) DossierStatut statut,
      @PageableDefault(size = 20, sort = "id") Pageable pageable) {
    return service.list(section, search, statut, pageable);
  }

  @GetMapping("/{id}")
  public DossierResponse get(@PathVariable Section section, @PathVariable Long id) {
    return service.get(section, id);
  }

  @PostMapping
  public ResponseEntity<DossierResponse> create(
      @PathVariable Section section, @Valid @RequestBody DossierRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(service.create(section, request));
  }

  @PutMapping("/{id}")
  public DossierResponse update(
      @PathVariable Section section, @PathVariable Long id, @Valid @RequestBody DossierRequest request) {
    return service.update(section, id, request);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Section section, @PathVariable Long id) {
    service.delete(section, id);
  }
}
