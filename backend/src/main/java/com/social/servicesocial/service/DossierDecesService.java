package com.social.servicesocial.service;

import com.social.servicesocial.dto.DossierDecesRequest;
import com.social.servicesocial.dto.DossierDecesResponse;
import com.social.servicesocial.exception.ConflictException;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.model.DossierDeces;
import com.social.servicesocial.model.DossierDecesHistorique;
import com.social.servicesocial.model.StatutDossierDeces;
import com.social.servicesocial.repository.AdherentRepository;
import com.social.servicesocial.repository.DossierDecesHistoriqueRepository;
import com.social.servicesocial.repository.DossierDecesRepository;
import java.time.Year;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DossierDecesService {

    private final DossierDecesRepository dossierDecesRepository;
    private final AdherentRepository adherentRepository;
    private final DossierDecesHistoriqueRepository historiqueRepository;

    @Transactional
    public DossierDecesResponse create(DossierDecesRequest req) {
        if (req.getAdherentId() == null) {
            throw new IllegalArgumentException("L'adherent est obligatoire.");
        }
        if (req.getDateDeces() == null) {
            throw new IllegalArgumentException("La date du deces est obligatoire.");
        }
        if (req.getLieuDeces() == null || req.getLieuDeces().isBlank()) {
            throw new IllegalArgumentException("Le lieu du deces est obligatoire.");
        }

        Adherent adherent = adherentRepository.findById(req.getAdherentId())
                .orElseThrow(() -> new NotFoundException("Adherent introuvable : " + req.getAdherentId()));

        if (dossierDecesRepository.existsByAdherentId(req.getAdherentId())) {
            throw new ConflictException("Un dossier de deces existe deja pour cet adherent.");
        }

        DossierDeces dossier = DossierDeces.builder()
                .numero(generateNumero())
                .adherentId(adherent.getId())
                .nomComplet(adherent.getNomAr() + " " + adherent.getPrenomAr())
                .dateDeces(req.getDateDeces())
                .lieuDeces(req.getLieuDeces().trim())
                .natureDeces(req.getNatureDeces())
                .causeDeces(req.getCauseDeces())
                .dpr(req.getDpr())
                .observation(req.getObservation())
                .statut(StatutDossierDeces.EN_COURS)
                .build();

        DossierDeces saved = dossierDecesRepository.save(dossier);
        addHistorique(saved.getId(), "CREATION_DOSSIER", null, saved.getStatut(), "Création du dossier", "system");
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<DossierDecesResponse> findAll() {
        return dossierDecesRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DossierDecesResponse findById(Long id) {
        return toResponse(required(id));
    }

    @Transactional
    public DossierDecesResponse update(Long id, DossierDecesRequest request) {
        DossierDeces dossier = required(id);
        if (dossier.getStatut() == StatutDossierDeces.VALIDE
                || dossier.getStatut() == StatutDossierDeces.CLOTURE
                || dossier.getStatut() == StatutDossierDeces.ARCHIVE) {
            throw new ConflictException("Le dossier valide, cloture ou archive ne peut plus etre modifie.");
        }
        if (request.getDateDeces() == null) {
            throw new ConflictException("La date de deces est obligatoire.");
        }
        if (request.getLieuDeces() == null || request.getLieuDeces().isBlank()) {
            throw new ConflictException("Le lieu de deces est obligatoire.");
        }

        dossier.setDateDeces(request.getDateDeces());
        dossier.setLieuDeces(request.getLieuDeces());
        dossier.setNatureDeces(request.getNatureDeces());
        dossier.setCauseDeces(request.getCauseDeces());
        dossier.setDpr(request.getDpr());
        dossier.setObservation(request.getObservation());
        addHistorique(dossier.getId(), "MODIFICATION_DOSSIER", dossier.getStatut(), dossier.getStatut(), "Modification des informations du dossier", "system");
        return toResponse(dossierDecesRepository.save(dossier));
    }

    public DossierDecesResponse updateStatut(Long id, String statut) {
        throw new ConflictException("Le statut d'un dossier décès est déterminé uniquement par le workflow de validation.");
    }
    @Transactional
    public void delete(Long id) {
        required(id);
        throw new ConflictException("La suppression physique d'un dossier décès est interdite. Clôturez puis archivez le dossier.");
    }

    DossierDeces required(Long id) {
        return dossierDecesRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Dossier deces introuvable : " + id));
    }

    void changeStatut(DossierDeces dossier, StatutDossierDeces next, String action, String commentaire, String username) {
        StatutDossierDeces previous = dossier.getStatut();
        assertTransition(previous, next);
        dossier.setStatut(next);
        dossier.setMotifDerniereDecision(commentaire);
        addHistorique(dossier.getId(), action, previous, next, commentaire, username);
    }

    DossierDecesResponse toResponse(DossierDeces d) {
        Adherent adherent = adherentRepository.findById(d.getAdherentId()).orElse(null);
        return DossierDecesResponse.builder()
                .id(d.getId())
                .numero(d.getNumero())
                .adherentId(d.getAdherentId())
                .nomComplet(d.getNomComplet())
                .matricule(adherent != null ? adherent.getMatricule() : null)
                .matriculeBR(adherent != null ? adherent.getMatriculeBR() : null)
                .cin(adherent != null ? adherent.getCin() : null)
                .dateDeces(d.getDateDeces())
                .lieuDeces(d.getLieuDeces())
                .natureDeces(d.getNatureDeces())
                .causeDeces(d.getCauseDeces())
                .dpr(d.getDpr())
                .observation(d.getObservation())
                .statut(d.getStatut() != null ? d.getStatut().name() : null)
                .dateCreation(d.getDateCreation())
                .dateMaj(d.getDateMaj())
                .dateValidation(d.getDateValidation())
                .dateSoumissionValidation(d.getDateSoumissionValidation())
                .dateRetourComplement(d.getDateRetourComplement())
                .dateCloture(d.getDateCloture())
                .soumisPar(d.getSoumisPar())
                .retournePar(d.getRetournePar())
                .validePar(d.getValidePar())
                .cloturePar(d.getCloturePar())
                .motifDerniereDecision(d.getMotifDerniereDecision())
                .build();
    }

    private String generateNumero() {
        int year = Year.now().getValue();
        long count = dossierDecesRepository.count() + 1;
        String numero;
        do {
            numero = String.format("DEC-%d-%05d", year, count++);
        } while (dossierDecesRepository.existsByNumero(numero));
        return numero;
    }

    private StatutDossierDeces parseStatut(String statut) {
        try {
            return StatutDossierDeces.valueOf(statut.toUpperCase());
        } catch (RuntimeException ex) {
            throw new IllegalArgumentException("Statut dossier deces invalide : " + statut);
        }
    }

    private void assertTransition(StatutDossierDeces current, StatutDossierDeces next) {
        if (current == next) {
            return;
        }
        boolean allowed = switch (current) {
            case NOUVEAU -> next == StatutDossierDeces.EN_COURS;
            case EN_COURS -> next == StatutDossierDeces.A_VALIDER || next == StatutDossierDeces.INCOMPLET;
            case INCOMPLET -> next == StatutDossierDeces.EN_COURS || next == StatutDossierDeces.A_VALIDER;
            case A_VALIDER -> next == StatutDossierDeces.VALIDE || next == StatutDossierDeces.INCOMPLET || next == StatutDossierDeces.REJETE;
            case VALIDE -> next == StatutDossierDeces.CLOTURE;
            case CLOTURE -> next == StatutDossierDeces.ARCHIVE;
            case REJETE, ARCHIVE -> false;
        };
        if (!allowed) {
            throw new ConflictException("Transition interdite : " + current + " vers " + next);
        }
    }

    private void addHistorique(Long dossierId, String action, StatutDossierDeces oldStatus, StatutDossierDeces newStatus, String commentaire, String username) {
        historiqueRepository.save(DossierDecesHistorique.builder()
                .dossierId(dossierId)
                .action(action)
                .ancienStatut(oldStatus)
                .nouveauStatut(newStatus)
                .commentaire(commentaire)
                .username(username)
                .build());
    }
}
