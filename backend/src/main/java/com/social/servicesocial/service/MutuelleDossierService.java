package com.social.servicesocial.service;

import com.social.servicesocial.dto.MutuelleDossierRequest;
import com.social.servicesocial.dto.MutuelleDossierResponse;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.model.MutuelleDossier;
import com.social.servicesocial.model.MutuelleCourrierType;
import com.social.servicesocial.model.MutuelleDossierType;
import com.social.servicesocial.repository.AdherentRepository;
import com.social.servicesocial.repository.MutuelleDossierRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MutuelleDossierService {

    private final MutuelleDossierRepository repository;
    private final AdherentRepository adherentRepository;

    public MutuelleDossierService(MutuelleDossierRepository repository, AdherentRepository adherentRepository) {
        this.repository = repository;
        this.adherentRepository = adherentRepository;
    }

    public List<MutuelleDossierResponse> list(String search, MutuelleCourrierType typeCourrier, MutuelleDossierType typeDossier,
                                              LocalDate dateFrom, LocalDate dateTo) {
        Specification<MutuelleDossier> spec = (root, query, cb) -> cb.conjunction();

        if (search != null && !search.isBlank()) {
            String value = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("numeroDossier")), value),
                    cb.like(cb.lower(root.get("numeroOrdre")), value),
                    cb.like(cb.lower(root.get("numeroEnvoi")), value),
                    cb.like(cb.lower(root.get("nomComplet")), value),
                    cb.like(cb.lower(root.get("matricule")), value),
                    cb.like(cb.lower(root.get("cin")), value),
                    cb.like(cb.lower(root.get("designation")), value)
            ));
        }

        if (typeCourrier != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("typeCourrier"), typeCourrier));
        }

        if (typeDossier != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("typeDossier"), typeDossier));
        }

        if (dateFrom != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("dateReception"), dateFrom));
        }

        if (dateTo != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("dateReception"), dateTo));
        }

        return repository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(this::toResponse).toList();
    }

    public MutuelleDossierResponse getById(Long id) {
        return toResponse(required(id));
    }

    @Transactional
    public MutuelleDossierResponse create(MutuelleDossierRequest request) {
        validate(request);
        Adherent adherent = adherentRequired(request.getAdherentId());

        MutuelleDossier entity = new MutuelleDossier();
        entity.setNumeroDossier(generateNumeroDossier());
        applyCommon(entity, request, adherent);
        return toResponse(repository.save(entity));
    }

    @Transactional
    public MutuelleDossierResponse update(Long id, MutuelleDossierRequest request) {
        validate(request);
        MutuelleDossier entity = required(id);
        Adherent adherent = adherentRequired(request.getAdherentId());

        applyCommon(entity, request, adherent);
        return toResponse(repository.save(entity));
    }

    private void applyCommon(MutuelleDossier entity, MutuelleDossierRequest request, Adherent adherent) {
        entity.setAdherentId(adherent.getId());
        entity.setNomComplet((adherent.getPrenomAr() + " " + adherent.getNomAr()).trim());
        entity.setGrade(adherent.getGrade());
        entity.setMatricule(adherent.getMatricule());
        entity.setCin(adherent.getCin());
        entity.setMatriculeBR(adherent.getMatriculeBR());
        entity.setUniteActuelle(adherent.getDernierUnite());
        entity.setTypeCourrier(request.getTypeCourrier());
        entity.setNumeroOrdre(trimmed(request.getNumeroOrdre()));
        entity.setNumeroEnvoi(trimmed(request.getNumeroEnvoi()));
        entity.setDateEnvoi(request.getDateEnvoi());
        entity.setDateReception(request.getDateReception());
        entity.setDesignation(trimmed(request.getDesignation()));
        entity.setTypeDossier(request.getTypeDossier());
        entity.setCentreSoin(trimmed(request.getCentreSoin()));
        entity.setObservation(trimmed(request.getObservation()));
    }

    private MutuelleDossier required(Long id) {
        return repository.findById(id).orElseThrow(() -> new IllegalArgumentException("Dossier mutuelle introuvable : " + id));
    }

    private Adherent adherentRequired(Long id) {
        return adherentRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Adhérent introuvable : " + id));
    }

    private void validate(MutuelleDossierRequest request) {
        if (request.getAdherentId() == null) {
            throw new IllegalArgumentException("Adhérent obligatoire");
        }
        if (request.getTypeCourrier() == null) {
            throw new IllegalArgumentException("Type courrier obligatoire");
        }
        if (request.getTypeDossier() == null) {
            throw new IllegalArgumentException("Type dossier obligatoire");
        }
    }

    private String generateNumeroDossier() {
        String candidate;
        do {
            candidate = "MUT-DOS-" + (repository.count() + 1 + System.nanoTime() % 1000);
        } while (repository.existsByNumeroDossier(candidate));
        return candidate;
    }

    private String trimmed(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private MutuelleDossierResponse toResponse(MutuelleDossier entity) {
        return new MutuelleDossierResponse(
                entity.getId(),
                entity.getNumeroDossier(),
                entity.getAdherentId(),
                entity.getNomComplet(),
                entity.getGrade(),
                entity.getMatricule(),
                entity.getCin(),
                entity.getMatriculeBR(),
                entity.getUniteActuelle(),
                entity.getTypeCourrier(),
                entity.getNumeroOrdre(),
                entity.getNumeroEnvoi(),
                entity.getDateEnvoi(),
                entity.getDateReception(),
                entity.getDesignation(),
                entity.getTypeDossier(),
                entity.getCentreSoin(),
                entity.getObservation(),
                entity.getCreatedAt()
        );
    }
}
