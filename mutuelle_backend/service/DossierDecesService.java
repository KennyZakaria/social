package mutuelle_backend.service;

import java.time.Year;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import mutuelle_backend.dto.DossierDecesRequest;
import mutuelle_backend.dto.DossierDecesResponse;
import mutuelle_backend.entity.Adherent;
import mutuelle_backend.entity.DossierDeces;
import mutuelle_backend.entity.StatutDossierDeces;
import mutuelle_backend.repository.AdherentRepository;
import mutuelle_backend.repository.DossierDecesRepository;

@Service
@RequiredArgsConstructor
public class DossierDecesService {

    private final DossierDecesRepository dossierDecesRepository;
    private final AdherentRepository adherentRepository;

    // =====================================================
    // CREATE
    // =====================================================

    @Transactional
    public DossierDecesResponse create(
            DossierDecesRequest request
    ) {

        // -----------------------------------------------
        // Validation
        // -----------------------------------------------

        if (request.getAdherentId() == null) {
            throw new IllegalArgumentException(
                    "L'adhérent est obligatoire."
            );
        }

        if (request.getDateDeces() == null) {
            throw new IllegalArgumentException(
                    "La date du décès est obligatoire."
            );
        }

        if (request.getLieuDeces() == null ||
                request.getLieuDeces().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Le lieu du décès est obligatoire."
            );
        }

        // -----------------------------------------------
        // Recherche adhérent
        // -----------------------------------------------

        Adherent adherent =
                adherentRepository.findById(request.getAdherentId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Adhérent introuvable : "
                                                + request.getAdherentId()
                                )
                        );

        // -----------------------------------------------
        // Vérifier si dossier existe déjà
        // -----------------------------------------------

        if (dossierDecesRepository
                .existsByAdherentId(request.getAdherentId())) {

            throw new IllegalArgumentException(
                    "Un dossier de décès existe déjà pour cet adhérent."
            );
        }

        // -----------------------------------------------
        // Nom complet
        // -----------------------------------------------

        String nomComplet =
                adherent.getNomAr()
                        + " "
                        + adherent.getPrenomAr();

        // -----------------------------------------------
        // Création
        // -----------------------------------------------

        DossierDeces dossier =
                DossierDeces.builder()

                        .numero(genererNumero())

                        .adherentId(
                                adherent.getId()
                        )

                        .nomComplet(
                                nomComplet
                        )

                        .dateDeces(
                                request.getDateDeces()
                        )

                        .lieuDeces(
                                request.getLieuDeces().trim()
                        )

                        .natureDeces(
                                request.getNatureDeces()
                        )

                        .causeDeces(
                                request.getCauseDeces()
                        )

                        .dpr(
                                request.getDpr()
                        )

                        .observation(
                                request.getObservation()
                        )

                        .statut(
                                StatutDossierDeces.EN_COURS
                        )

                        .build();

        DossierDeces saved =
                dossierDecesRepository.save(dossier);

        return toResponse(saved);
    }

    // =====================================================
    // GET ALL
    // =====================================================

    @Transactional(readOnly = true)
    public List<DossierDecesResponse> findAll() {

        return dossierDecesRepository
                .findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    @Transactional(readOnly = true)
    public DossierDecesResponse findById(Long id) {

        DossierDeces dossier =
                dossierDecesRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Dossier décès introuvable : "
                                                + id
                                )
                        );

        return toResponse(dossier);
    }

    // =====================================================
    // GENERATE NUMBER
    // =====================================================

    private String genererNumero() {

        int year = Year.now().getValue();

        long count =
                dossierDecesRepository.count() + 1;

        String numero;

        do {

            numero =
                    String.format(
                            "DEC-%d-%05d",
                            year,
                            count
                    );

            count++;

        } while (
                dossierDecesRepository
                        .existsByNumero(numero)
        );

        return numero;
    }

    // =====================================================
    // MAPPER
    // =====================================================

    private DossierDecesResponse toResponse(
            DossierDeces dossier
    ) {

        return DossierDecesResponse.builder()

                .id(
                        dossier.getId()
                )

                .numero(
                        dossier.getNumero()
                )

                .adherentId(
                        dossier.getAdherentId()
                )

                .nomComplet(
                        dossier.getNomComplet()
                )

                .dateDeces(
                        dossier.getDateDeces()
                )

                .lieuDeces(
                        dossier.getLieuDeces()
                )

                .natureDeces(
                        dossier.getNatureDeces()
                )

                .causeDeces(
                        dossier.getCauseDeces()
                )

                .dpr(
                        dossier.getDpr()
                )

                .observation(
                        dossier.getObservation()
                )

                .statut(
                        dossier.getStatut().name()
                )

                .build();
    }
}