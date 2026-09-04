package com.social.servicesocial.service;

import com.social.servicesocial.dto.*;
import com.social.servicesocial.exception.ConflictException;
import com.social.servicesocial.exception.NotFoundException;
import com.social.servicesocial.model.*;
import com.social.servicesocial.repository.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ValidationDecesService {
    private static final List<String> PIECES_OBLIGATOIRES = List.of("ACTE_DECES", "CIN_ADHERENT", "LIVRET_FAMILLE", "RIB_BENEFICIAIRE");

    private final DossierDecesRepository dossierRepository;
    private final AdherentRepository adherentRepository;
    private final AyantDroitRepository ayantDroitRepository;
    private final DemandeDecesRepository demandeRepository;
    private final PieceJustificativeRepository pieceRepository;
    private final DossierDecesHistoriqueRepository historiqueRepository;
    private final DossierDecesService dossierService;

    @Transactional(readOnly = true)
    public List<DossierDecesResponse> dossiersValidation(String search, String statut) {
        String value = normalize(search);
        return dossierRepository.findAll().stream()
                .filter(d -> statut == null || statut.isBlank() || d.getStatut().name().equalsIgnoreCase(statut))
                .filter(d -> statut != null && !statut.isBlank() || d.getStatut() == StatutDossierDeces.A_VALIDER || d.getStatut() == StatutDossierDeces.INCOMPLET || d.getStatut() == StatutDossierDeces.REJETE)
                .filter(d -> matchesSearch(d, value))
                .map(dossierService::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ValidationResultResponse verifierDossier(Long dossierId) {
        DossierDeces dossier = required(dossierId);
        List<String> erreurs = new ArrayList<>();
        List<String> avertissements = new ArrayList<>();
        List<ValidationControleResponse> details = new ArrayList<>();
        Map<String, Boolean> controles = new LinkedHashMap<>();

        Adherent adherent = adherentRepository.findById(dossier.getAdherentId()).orElse(null);
        boolean adherentOk = adherent != null && notBlank(adherent.getMatricule()) && notBlank(adherent.getCin());
        controles.put("adherent", adherentOk);
        details.add(new ValidationControleResponse("adherent", "Informations adherent", adherentOk,
                adherentOk ? "Adherent correctement lie." : "Adherent introuvable ou identifiants manquants."));
        if (!adherentOk) erreurs.add("Adherent introuvable ou identifiants manquants.");

        boolean decesOk = dossier.getAdherentId() != null && dossier.getDateDeces() != null && notBlank(dossier.getLieuDeces());
        controles.put("informationsDeces", decesOk);
        details.add(new ValidationControleResponse("informationsDeces", "Informations deces", decesOk,
                decesOk ? "Date et lieu de deces renseignes." : "Date ou lieu de deces obligatoire manquant."));
        if (!decesOk) erreurs.add("Date ou lieu de deces obligatoire manquant.");

        List<AyantDroit> ayants = adherent == null ? List.of() : ayantDroitRepository.findByAdherentIdOrderByIdAsc(adherent.getId());
        List<String> ayantsErrors = new ArrayList<>();
        if (ayants.isEmpty()) {
            ayantsErrors.add("Aucun ayant droit renseigne.");
        }
        ayants.forEach(a -> {
            if (!notBlank(a.getNom()) || !notBlank(a.getPrenom()) || !notBlank(a.getCin()) || !notBlank(a.getLienParente())) {
                ayantsErrors.add("Ayant droit incomplet : " + safeName(a.getPrenom(), a.getNom()));
            }
            if (a.getTypeRepartition() == TypeRepartition.POURCENTAGE && a.getPourcentage() == null) {
                ayantsErrors.add("Pourcentage manquant pour : " + safeName(a.getPrenom(), a.getNom()));
            }
        });
        boolean ayantsOk = ayantsErrors.isEmpty();
        controles.put("ayantsDroit", ayantsOk);
        details.add(new ValidationControleResponse("ayantsDroit", "Ayants droit", ayantsOk,
                ayantsOk ? "Ayants droit complets." : String.join(" ", ayantsErrors)));
        erreurs.addAll(ayantsErrors);

        List<DemandeDeces> demandes = demandeRepository.findByDossierIdOrderByDateDemandeDesc(dossierId);
        List<String> demandeErrors = new ArrayList<>();
        demandes.forEach(demande -> {
            if (!notBlank(demande.getTypeDemande()) || demande.getStatut() == null || demande.getDateDemande() == null) {
                demandeErrors.add("Demande incompletement renseignee : " + demande.getId());
            }
        });
        boolean demandesOk = demandeErrors.isEmpty();
        controles.put("demandes", demandesOk);
        details.add(new ValidationControleResponse("demandes", "Demandes", demandesOk,
                demandesOk ? "Demandes controlees." : String.join(" ", demandeErrors)));
        erreurs.addAll(demandeErrors);

        List<PieceJustificative> pieces = pieceRepository.findByDossierIdOrderByTypePieceAsc(dossierId);
        List<String> piecesErrors = new ArrayList<>();
        for (String required : PIECES_OBLIGATOIRES) {
            PieceJustificative piece = pieces.stream().filter(p -> required.equals(p.getTypePiece())).findFirst().orElse(null);
            if (piece == null || !piece.isPresent()) {
                piecesErrors.add("Piece obligatoire manquante : " + required);
            }
        }
        boolean piecesOk = piecesErrors.isEmpty();
        controles.put("pieces", piecesOk);
        details.add(new ValidationControleResponse("pieces", "Pieces justificatives", piecesOk,
                piecesOk ? "Pieces obligatoires presentes." : String.join(" ", piecesErrors)));
        erreurs.addAll(piecesErrors);

        int okCount = (int) controles.values().stream().filter(Boolean::booleanValue).count();
        int progression = controles.isEmpty() ? 0 : (int) Math.round(okCount * 100.0 / controles.size());
        return new ValidationResultResponse(erreurs.isEmpty(), progression, erreurs, avertissements, controles, details);
    }

    @Transactional
    public DossierValidationResponse soumettreValidation(Long dossierId, String username) {
        DossierDeces dossier = required(dossierId);
        if (dossier.getStatut() != StatutDossierDeces.EN_COURS && dossier.getStatut() != StatutDossierDeces.INCOMPLET) {
            throw new ConflictException("Le dossier doit etre EN_COURS ou INCOMPLET pour etre soumis a validation.");
        }
        ValidationResultResponse controle = verifierDossier(dossierId);
        if (!controle.valid()) {
            throw new ConflictException("Le dossier contient des anomalies bloquantes.");
        }
        changeStatus(dossier, StatutDossierDeces.A_VALIDER, "SOUMISSION_VALIDATION", "Dossier soumis a validation", username);
        return new DossierValidationResponse(dossierService.toResponse(dossierRepository.save(dossier)), controle);
    }

    @Transactional
    public DossierValidationResponse valider(Long dossierId, ValidationDecesRequest request, String username) {
        DossierDeces dossier = required(dossierId);
        if (dossier.getStatut() != StatutDossierDeces.A_VALIDER) {
            throw new ConflictException("Le dossier doit etre au statut A_VALIDER pour etre valide.");
        }
        ValidationResultResponse controle = verifierDossier(dossierId);
        if (!controle.valid()) {
            throw new ConflictException("Le dossier contient des anomalies bloquantes.");
        }
        dossier.setDateValidation(LocalDateTime.now());
        dossier.setValidePar(username);
        changeStatus(dossier, StatutDossierDeces.VALIDE, "VALIDATION", valueOrDefault(request.commentaire(), "Dossier verifie et valide"), username);
        return new DossierValidationResponse(dossierService.toResponse(dossierRepository.save(dossier)), controle);
    }

    @Transactional
    public DossierDecesResponse retourComplement(Long dossierId, RetourComplementRequest request, String username) {
        DossierDeces dossier = requiredAValider(dossierId);
        changeStatus(dossier, StatutDossierDeces.INCOMPLET, "RETOUR_COMPLEMENT", request.motif(), username);
        return dossierService.toResponse(dossierRepository.save(dossier));
    }

    @Transactional
    public DossierDecesResponse rejeter(Long dossierId, RejetDecesRequest request, String username) {
        DossierDeces dossier = requiredAValider(dossierId);
        changeStatus(dossier, StatutDossierDeces.REJETE, "REJET", request.motif(), username);
        return dossierService.toResponse(dossierRepository.save(dossier));
    }

    @Transactional
    public DossierDecesResponse cloturer(Long dossierId, String username) {
        DossierDeces dossier = required(dossierId);
        if (dossier.getStatut() != StatutDossierDeces.VALIDE) {
            throw new ConflictException("Seul un dossier VALIDE peut etre cloture.");
        }
        dossier.setDateCloture(LocalDateTime.now());
        dossier.setCloturePar(username);
        changeStatus(dossier, StatutDossierDeces.CLOTURE, "CLOTURE", "Dossier cloture", username);
        return dossierService.toResponse(dossierRepository.save(dossier));
    }

    @Transactional(readOnly = true)
    public List<HistoriqueDossierDecesResponse> historique(Long dossierId) {
        required(dossierId);
        return historiqueRepository.findByDossierIdOrderByDateActionDesc(dossierId).stream()
                .map(h -> new HistoriqueDossierDecesResponse(h.getId(), h.getDossierId(), h.getAction(),
                        h.getAncienStatut() != null ? h.getAncienStatut().name() : null,
                        h.getNouveauStatut() != null ? h.getNouveauStatut().name() : null,
                        h.getCommentaire(), h.getUsername(), h.getDateAction()))
                .toList();
    }

    private DossierDeces required(Long dossierId) {
        return dossierRepository.findById(dossierId).orElseThrow(() -> new NotFoundException("Dossier deces introuvable : " + dossierId));
    }

    private DossierDeces requiredAValider(Long dossierId) {
        DossierDeces dossier = required(dossierId);
        if (dossier.getStatut() != StatutDossierDeces.A_VALIDER) {
            throw new ConflictException("Le dossier doit etre au statut A_VALIDER.");
        }
        return dossier;
    }

    private void changeStatus(DossierDeces dossier, StatutDossierDeces next, String action, String comment, String username) {
        StatutDossierDeces previous = dossier.getStatut();
        dossierService.changeStatut(dossier, next, action, comment, username);
        dossier.setMotifDerniereDecision(comment);
        if (previous == next) {
            addHistory(dossier.getId(), action, previous, next, comment, username);
        }
    }

    private void addHistory(Long dossierId, String action, StatutDossierDeces previous, StatutDossierDeces next, String comment, String username) {
        historiqueRepository.save(DossierDecesHistorique.builder()
                .dossierId(dossierId)
                .action(action)
                .ancienStatut(previous)
                .nouveauStatut(next)
                .commentaire(comment)
                .username(username)
                .build());
    }

    private boolean matchesSearch(DossierDeces d, String value) {
        if (value.isBlank()) return true;
        Adherent adherent = adherentRepository.findById(d.getAdherentId()).orElse(null);
        return normalize(d.getNumero()).contains(value)
                || normalize(d.getNomComplet()).contains(value)
                || (adherent != null && (normalize(adherent.getMatricule()).contains(value)
                || normalize(adherent.getMatriculeBR()).contains(value)
                || normalize(adherent.getCin()).contains(value)
                || normalize(adherent.getNomAr()).contains(value)
                || normalize(adherent.getPrenomAr()).contains(value)));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }

    private String safeName(String prenom, String nom) {
        String full = (valueOrDefault(prenom, "") + " " + valueOrDefault(nom, "")).trim();
        return full.isBlank() ? "ID inconnu" : full;
    }

    private String valueOrDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }
}
