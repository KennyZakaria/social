package mutuelle_backend.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.AdherentPageResponse;
import mutuelle_backend.dto.AdherentRequest;
import mutuelle_backend.dto.AdherentResponse;
import mutuelle_backend.dto.AdherentStatistics;
import mutuelle_backend.entity.Adherent;
import mutuelle_backend.exception.ConflictException;
import mutuelle_backend.exception.NotFoundException;
import mutuelle_backend.repository.AdherentRepository;


@Service
@RequiredArgsConstructor
public class AdherentService {


    private final AdherentRepository repository;


    // =====================================================
    // LIST
    // =====================================================

    public AdherentPageResponse list(

            String search,
            String categorie,
            String situation,
            Pageable pageable

    ) {

        Specification<Adherent> specification =
                (root, query, criteriaBuilder) ->
                        criteriaBuilder.conjunction();


        // =================================================
        // SEARCH
        // =================================================

        if (search != null && !search.isBlank()) {

            String value =
                    "%" +
                    search
                            .trim()
                            .toLowerCase(Locale.ROOT)
                    +
                    "%";


            specification =
                    specification.and(

                            (root, query, cb) -> cb.or(

                                    cb.like(
                                            cb.lower(
                                                    root.get("nomAr")
                                            ),
                                            value
                                    ),

                                    cb.like(
                                            cb.lower(
                                                    root.get("prenomAr")
                                            ),
                                            value
                                    ),

                                    cb.like(
                                            cb.lower(
                                                    root.get("matricule")
                                            ),
                                            value
                                    ),

                                    cb.like(
                                            cb.lower(
                                                    root.get("matriculeBR")
                                            ),
                                            value
                                    ),

                                    cb.like(
                                            cb.lower(
                                                    root.get("cin")
                                            ),
                                            value
                                    )
                            )
                    );
        }


        // =================================================
        // CATEGORIE
        // =================================================

        if (
                categorie != null
                        &&
                !categorie.isBlank()
        ) {

            specification =
                    specification.and(

                            (root, query, cb) ->
                                    cb.equal(
                                            root.get("categorie"),
                                            categorie.trim()
                                    )
                    );
        }


        // =================================================
        // SITUATION
        // =================================================

        if (
                situation != null
                        &&
                !situation.isBlank()
        ) {

            specification =
                    specification.and(

                            (root, query, cb) ->
                                    cb.equal(
                                            root.get("situationCategorie"),
                                            situation.trim()
                                    )
                    );
        }


        // =================================================
        // DATABASE QUERY
        // =================================================

        Page<AdherentResponse> page =

                repository
                        .findAll(specification, pageable)
                        .map(this::toResponse);


        // =================================================
        // STABLE PAGINATION DTO
        // =================================================

        return new AdherentPageResponse(

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


    // =====================================================
    // GET BY ID
    // =====================================================

    public AdherentResponse get(Long id) {

        return toResponse(
                required(id)
        );
    }


    // =====================================================
    // CREATE
    // =====================================================

    @Transactional
    public AdherentResponse create(
            AdherentRequest request
    ) {

        validateUnique(
                request,
                null
        );


        Adherent adherent =
                fromRequest(
                        new Adherent(),
                        request
                );


        Adherent saved =
                repository.save(adherent);


        return toResponse(saved);
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @Transactional
    public AdherentResponse update(

            Long id,

            AdherentRequest request

    ) {

        Adherent adherent =
                required(id);


        validateUnique(
                request,
                id
        );


        fromRequest(
                adherent,
                request
        );


        Adherent saved =
                repository.save(adherent);


        return toResponse(saved);
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Transactional
    public void delete(Long id) {

        Adherent adherent =
                required(id);

        repository.delete(adherent);
    }


    // =====================================================
    // STATISTICS
    // =====================================================

    public AdherentStatistics statistics() {

        List<Adherent> all =
                repository.findAll();


        long total =
                all.size();


        long actifs =
                all.stream()
                        .filter(a ->
                                "Actif".equalsIgnoreCase(
                                        a.getSituationCategorie()
                                )
                        )
                        .count();


        long retraites =
                all.stream()
                        .filter(a ->

                                "Retraité"
                                        .equalsIgnoreCase(
                                                a.getSituationCategorie()
                                        )

                                ||

                                "Retraite"
                                        .equalsIgnoreCase(
                                                a.getSituationCategorie()
                                        )
                        )
                        .count();


        long pensionnes =
                all.stream()
                        .filter(Adherent::isPension)
                        .count();


        return new AdherentStatistics(

                total,

                actifs,

                retraites,

                pensionnes
        );
    }


    // =====================================================
    // FIND BY ID
    // =====================================================

    private Adherent required(Long id) {

        return repository
                .findById(id)
                .orElseThrow(

                        () ->
                                new NotFoundException(
                                        "Adherent not found: " + id
                                )
                );
    }


    // =====================================================
    // UNIQUE VALIDATION
    // =====================================================

    private void validateUnique(

            AdherentRequest request,

            Long id

    ) {

        Long ignoredId =
                id == null
                        ? -1L
                        : id;


        if (
                repository.existsByMatriculeAndIdNot(
                        request.matricule(),
                        ignoredId
                )
        ) {

            throw new ConflictException(
                    "Matricule already exists"
            );
        }


        if (
                repository.existsByCinAndIdNot(
                        request.cin(),
                        ignoredId
                )
        ) {

            throw new ConflictException(
                    "CIN already exists"
            );
        }
    }


    // =====================================================
    // REQUEST -> ENTITY
    // =====================================================

    private Adherent fromRequest(

            Adherent adherent,

            AdherentRequest request

    ) {

        adherent.setPrenomAr(
                request.prenomAr()
        );

        adherent.setNomAr(
                request.nomAr()
        );

        adherent.setCategorie(
                request.categorie()
        );

        adherent.setGrade(
                request.grade()
        );

        adherent.setMatriculeBR(
                request.matriculeBR()
        );

        adherent.setMatricule(
                request.matricule()
        );

        adherent.setDateNaissance(
                request.dateNaissance()
        );

        adherent.setLieuNaissance(
                request.lieuNaissance()
        );

        adherent.setDateRadiation(
                request.dateRadiation()
        );

        adherent.setMotifRadiation(
                request.motifRadiation()
        );

        adherent.setDateDeces(
                request.dateDeces()
        );

        adherent.setCauseDeces(
                request.causeDeces()
        );

        adherent.setDernierUnite(
                request.dernierUnite()
        );

        adherent.setFormationUnite(
                request.formationUnite()
        );

        adherent.setTelephone1(
                request.telephone1()
        );

        adherent.setTelephone2(
                request.telephone2()
        );

        adherent.setAdresse(
                request.adresse()
        );

        adherent.setEmail(
                request.email()
        );

        adherent.setSituationCategorie(
                request.situationCategorie()
        );

        adherent.setPension(
                request.pension()
        );

        adherent.setCin(
                request.cin()
        );


        return adherent;
    }


    // =====================================================
    // ENTITY -> RESPONSE
    // =====================================================

    private AdherentResponse toResponse(
            Adherent adherent
    ) {

        return new AdherentResponse(

                adherent.getId(),

                adherent.getPrenomAr(),

                adherent.getNomAr(),

                adherent.getCategorie(),

                adherent.getGrade(),

                adherent.getMatriculeBR(),

                adherent.getMatricule(),

                adherent.getDateNaissance(),

                adherent.getLieuNaissance(),

                adherent.getDateRadiation(),

                adherent.getMotifRadiation(),

                adherent.getDateDeces(),

                adherent.getCauseDeces(),

                adherent.getDernierUnite(),

                adherent.getFormationUnite(),

                adherent.getTelephone1(),

                adherent.getTelephone2(),

                adherent.getAdresse(),

                adherent.getEmail(),

                adherent.getSituationCategorie(),

                adherent.isPension(),

                adherent.getCin()
        );
    }
}