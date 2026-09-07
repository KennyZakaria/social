package mutuelle_backend.service;

import java.util.Locale;
import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.*;
import mutuelle_backend.entity.Dossier;
import mutuelle_backend.entity.DossierStatut;
import mutuelle_backend.entity.Section;
import mutuelle_backend.exception.*;
import mutuelle_backend.repository.DossierRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DossierService {

  private final DossierRepository repository;

  public Page<DossierResponse> list(Section section, String search, DossierStatut statut, Pageable pageable) {
    Specification<Dossier> spec = (r, q, c) -> c.equal(r.get("section"), section);

    if (search != null && !search.isBlank()) {
      String v = "%" + search.toLowerCase(Locale.ROOT).trim() + "%";
      spec = spec.and((r, q, c) -> c.or(
          c.like(c.lower(r.get("numero")), v),
          c.like(c.lower(r.get("adherentNom")), v),
          c.like(c.lower(r.get("matricule")), v)
      ));
    }

    if (statut != null) {
      spec = spec.and((r, q, c) -> c.equal(r.get("statut"), statut));
    }

    return repository.findAll(spec, pageable).map(this::toResponse);
  }

  public DossierResponse get(Section section, Long id) {
    return toResponse(requiredInSection(section, id));
  }

  @Transactional
  public DossierResponse create(Section section, DossierRequest r) {
    validateUniqueNumero(r.numero(), null);
    Dossier d = Dossier.builder()
        .section(section)
        .numero(r.numero())
        .adherentNom(r.adherentNom())
        .matricule(r.matricule())
        .dateEvenement(r.dateEvenement())
        .lieu(r.lieu())
        .nature(r.nature())
        .description(r.description())
        .statut(r.statut())
        .build();
    return toResponse(repository.save(d));
  }

  @Transactional
  public DossierResponse update(Section section, Long id, DossierRequest r) {
    Dossier d = requiredInSection(section, id);
    validateUniqueNumero(r.numero(), id);
    d.setNumero(r.numero());
    d.setAdherentNom(r.adherentNom());
    d.setMatricule(r.matricule());
    d.setDateEvenement(r.dateEvenement());
    d.setLieu(r.lieu());
    d.setNature(r.nature());
    d.setDescription(r.description());
    d.setStatut(r.statut());
    return toResponse(repository.save(d));
  }

  @Transactional
  public void delete(Section section, Long id) {
    repository.delete(requiredInSection(section, id));
  }

  private Dossier requiredInSection(Section section, Long id) {
    Dossier d = repository.findById(id)
        .orElseThrow(() -> new NotFoundException("Dossier not found: " + id));
    if (d.getSection() != section) {
      throw new NotFoundException("Dossier not found: " + id);
    }
    return d;
  }

  private void validateUniqueNumero(String numero, Long id) {
    Long x = id == null ? -1L : id;
    if (repository.existsByNumeroAndIdNot(numero, x)) {
      throw new ConflictException("Numéro de dossier déjà utilisé");
    }
  }

  private DossierResponse toResponse(Dossier d) {
    return new DossierResponse(
        d.getId(), d.getSection(), d.getNumero(), d.getAdherentNom(), d.getMatricule(),
        d.getDateEvenement(), d.getLieu(), d.getNature(), d.getDescription(),
        d.getStatut(), d.getDateCreation(), d.getDateMaj()
    );
  }
}
