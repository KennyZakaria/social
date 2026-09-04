package com.social.servicesocial.service;

import com.social.servicesocial.dto.AssuranceRecordRequest;
import com.social.servicesocial.dto.AssuranceRecordResponse;
import com.social.servicesocial.model.Adherent;
import com.social.servicesocial.model.AssuranceRecord;
import com.social.servicesocial.model.AssuranceRecordType;
import com.social.servicesocial.repository.AdherentRepository;
import com.social.servicesocial.repository.AssuranceRecordRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssuranceRecordService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final AssuranceRecordRepository repository;
    private final AdherentRepository adherentRepository;

    public AssuranceRecordService(AssuranceRecordRepository repository, AdherentRepository adherentRepository) {
        this.repository = repository;
        this.adherentRepository = adherentRepository;
    }

    public List<AssuranceRecordResponse> list(AssuranceRecordType type, String search, Boolean imputable, String referenceEnvoi) {
        Specification<AssuranceRecord> spec = (root, query, cb) -> cb.conjunction();

        if (type != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        }

        if (search != null && !search.isBlank()) {
            String value = "%" + search.trim().toLowerCase(Locale.ROOT) + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("numero")), value),
                    cb.like(cb.lower(root.get("nomComplet")), value),
                    cb.like(cb.lower(root.get("matricule")), value),
                    cb.like(cb.lower(root.get("cin")), value),
                    cb.like(cb.lower(root.get("grade")), value)
            ));
        }

        if (type == AssuranceRecordType.INVALIDITE && imputable != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("imputable"), imputable));
        }

        if (type == AssuranceRecordType.DECES && referenceEnvoi != null && !referenceEnvoi.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("referenceEnvoi"), referenceEnvoi));
        }

        return repository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt")).stream().map(this::toResponse).toList();
    }

    public AssuranceRecordResponse getById(Long id) {
        return toResponse(required(id));
    }

    @Transactional
    public AssuranceRecordResponse create(AssuranceRecordRequest request) {
        validate(request);

        Adherent adherent = adherentRepository.findById(request.getAdherentId())
                .orElseThrow(() -> new IllegalArgumentException("Adhérent introuvable : " + request.getAdherentId()));

        AssuranceRecord entity = new AssuranceRecord();
        entity.setType(request.getType());
        entity.setNumero(generateNumero(request.getType()));
        entity.setAdherentId(adherent.getId());
        entity.setNomComplet((adherent.getPrenomAr() + " " + adherent.getNomAr()).trim());
        entity.setGrade(adherent.getGrade());
        entity.setMatricule(adherent.getMatricule());
        entity.setCin(adherent.getCin());
        entity.setMatriculeBR(adherent.getMatriculeBR());
        entity.setUniteActuelle(adherent.getDernierUnite());
        entity.setDesignation(blankToNull(request.getDesignation()));
        entity.setMaladie(blankToNull(request.getMaladie()));
        entity.setCodeMaladie(blankToNull(request.getCodeMaladie()));
        entity.setDateCommission(request.getDateCommission());
        entity.setTauxInvalidite(request.getTauxInvalidite());
        entity.setImputable(request.getImputable());
        entity.setDateDeces(request.getDateDeces());
        entity.setCauseDeces(blankToNull(request.getCauseDeces()));
        entity.setReferenceEnvoi(blankToNull(request.getReferenceEnvoi()));
        entity.setPeculeMontant(request.getPeculeMontant());
        entity.setDecesMontant(request.getDecesMontant());

        return toResponse(repository.save(entity));
    }

    @Transactional
    public AssuranceRecordResponse update(Long id, AssuranceRecordRequest request) {
        validate(request);

        AssuranceRecord entity = required(id);
        Adherent adherent = adherentRepository.findById(request.getAdherentId())
                .orElseThrow(() -> new IllegalArgumentException("Adhérent introuvable : " + request.getAdherentId()));

        entity.setType(request.getType());
        entity.setAdherentId(adherent.getId());
        entity.setNomComplet((adherent.getPrenomAr() + " " + adherent.getNomAr()).trim());
        entity.setGrade(adherent.getGrade());
        entity.setMatricule(adherent.getMatricule());
        entity.setCin(adherent.getCin());
        entity.setMatriculeBR(adherent.getMatriculeBR());
        entity.setUniteActuelle(adherent.getDernierUnite());
        entity.setDesignation(blankToNull(request.getDesignation()));
        entity.setMaladie(blankToNull(request.getMaladie()));
        entity.setCodeMaladie(blankToNull(request.getCodeMaladie()));
        entity.setDateCommission(request.getDateCommission());
        entity.setTauxInvalidite(request.getTauxInvalidite());
        entity.setImputable(request.getImputable());
        entity.setDateDeces(request.getDateDeces());
        entity.setCauseDeces(blankToNull(request.getCauseDeces()));
        entity.setReferenceEnvoi(blankToNull(request.getReferenceEnvoi()));
        entity.setPeculeMontant(request.getPeculeMontant());
        entity.setDecesMontant(request.getDecesMontant());

        return toResponse(repository.save(entity));
    }

    public byte[] exportExcel(AssuranceRecordType type, String search, Boolean imputable, String referenceEnvoi) {
        List<AssuranceRecordResponse> rows = list(type, search, imputable, referenceEnvoi);

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(type == AssuranceRecordType.INVALIDITE ? "Invalidite" : type == AssuranceRecordType.DECES ? "Deces" : "Historique");
            createHeader(sheet, type);

            int rowIndex = 1;
            for (AssuranceRecordResponse record : rows) {
                Row row = sheet.createRow(rowIndex++);
                int col = 0;
                row.createCell(col++).setCellValue(s(record.numero()));
                row.createCell(col++).setCellValue(s(record.nomComplet()));
                row.createCell(col++).setCellValue(s(record.grade()));
                row.createCell(col++).setCellValue(s(record.matricule()));
                row.createCell(col++).setCellValue(s(record.cin()));
                row.createCell(col++).setCellValue(s(record.matriculeBR()));
                row.createCell(col++).setCellValue(s(record.uniteActuelle()));

                if (type == null) {
                    row.createCell(col++).setCellValue(record.type() == AssuranceRecordType.INVALIDITE ? "Invalidité" : "Décès");
                    row.createCell(col++).setCellValue(record.type() == AssuranceRecordType.INVALIDITE ? s(record.maladie()) : s(record.causeDeces()));
                    row.createCell(col++).setCellValue(record.type() == AssuranceRecordType.INVALIDITE ? formatDate(record.dateCommission()) : formatDate(record.dateDeces()));
                    row.createCell(col++).setCellValue(record.type() == AssuranceRecordType.INVALIDITE ? (Boolean.TRUE.equals(record.imputable()) ? "Imputable" : "Non imputable") : s(record.referenceEnvoi()));
                    row.createCell(col++).setCellValue(record.type() == AssuranceRecordType.INVALIDITE ? decimal(record.tauxInvalidite()) : decimal(record.peculeMontant()));
                    row.createCell(col).setCellValue(record.type() == AssuranceRecordType.INVALIDITE ? 0d : decimal(record.decesMontant()));
                } else if (type == AssuranceRecordType.INVALIDITE) {
                    row.createCell(col++).setCellValue(s(record.designation()));
                    row.createCell(col++).setCellValue(s(record.maladie()));
                    row.createCell(col++).setCellValue(s(record.codeMaladie()));
                    row.createCell(col++).setCellValue(formatDate(record.dateCommission()));
                    row.createCell(col++).setCellValue(decimal(record.tauxInvalidite()));
                    row.createCell(col).setCellValue(Boolean.TRUE.equals(record.imputable()) ? "Oui" : "Non");
                } else {
                    row.createCell(col++).setCellValue(formatDate(record.dateDeces()));
                    row.createCell(col++).setCellValue(s(record.causeDeces()));
                    row.createCell(col++).setCellValue(s(record.referenceEnvoi()));
                    row.createCell(col++).setCellValue(decimal(record.peculeMontant()));
                    row.createCell(col).setCellValue(decimal(record.decesMontant()));
                }
            }

            for (int i = 0; i < sheet.getRow(0).getLastCellNum(); i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(output);
            return output.toByteArray();
        } catch (IOException exception) {
            throw new IllegalStateException("Impossible de générer le fichier Excel", exception);
        }
    }

    private AssuranceRecord required(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier assurance introuvable : " + id));
    }

    private void validate(AssuranceRecordRequest request) {
        if (request.getType() == AssuranceRecordType.INVALIDITE) {
            require(request.getDateCommission() != null, "La date de commission est obligatoire");
            require(request.getTauxInvalidite() != null, "Le taux d'invalidité est obligatoire");
            require(request.getImputable() != null, "L'imputabilité est obligatoire");
        }
        if (request.getType() == AssuranceRecordType.DECES) {
            require(request.getDateDeces() != null, "La date de décès est obligatoire");
            require(notBlank(request.getCauseDeces()), "La cause du décès est obligatoire");
            require(notBlank(request.getReferenceEnvoi()), "La référence d'envoi est obligatoire");
        }
    }

    private String generateNumero(AssuranceRecordType type) {
        String prefix = type == AssuranceRecordType.INVALIDITE ? "INV" : "DEC";
        String candidate;
        do {
            candidate = prefix + "-ASS-" + (repository.countByType(type) + 1 + System.nanoTime() % 1000);
        } while (repository.existsByNumero(candidate));
        return candidate;
    }

    private AssuranceRecordResponse toResponse(AssuranceRecord entity) {
        return new AssuranceRecordResponse(
                entity.getId(),
                entity.getNumero(),
                entity.getType(),
                entity.getAdherentId(),
                entity.getNomComplet(),
                entity.getGrade(),
                entity.getMatricule(),
                entity.getCin(),
                entity.getMatriculeBR(),
                entity.getUniteActuelle(),
                entity.getDesignation(),
                entity.getMaladie(),
                entity.getCodeMaladie(),
                entity.getDateCommission(),
                entity.getTauxInvalidite(),
                entity.getImputable(),
                entity.getDateDeces(),
                entity.getCauseDeces(),
                entity.getReferenceEnvoi(),
                entity.getPeculeMontant(),
                entity.getDecesMontant(),
                entity.getCreatedAt()
        );
    }

    private void createHeader(Sheet sheet, AssuranceRecordType type) {
        Row row = sheet.createRow(0);
        String[] headers = type == null
            ? new String[] { "N°", "Nom et prénom", "Grade", "Matricule", "CIN", "Mle BR", "Unité actuelle", "Type", "Détail", "Date", "Référence / Statut", "Valeur 1", "Valeur 2" }
            : type == AssuranceRecordType.INVALIDITE
                ? new String[] { "N°", "Nom et prénom", "Grade", "Matricule", "CIN", "Mle BR", "Unité actuelle", "Désignation", "Maladie", "Code maladie", "Date commission", "Taux invalidité", "Imputabilité" }
                : new String[] { "N°", "Nom et prénom", "Grade", "Matricule", "CIN", "Mle BR", "Unité actuelle", "Date décès", "Cause", "Réf. d'envoi", "Pécule", "Décès" };

        for (int i = 0; i < headers.length; i++) {
            row.createCell(i).setCellValue(headers[i]);
        }
    }

    private void require(boolean condition, String message) {
        if (!condition) {
            throw new IllegalArgumentException(message);
        }
    }

    private boolean notBlank(String value) {
        return value != null && !value.isBlank();
    }

    private String blankToNull(String value) {
        return notBlank(value) ? value.trim() : null;
    }

    private String formatDate(LocalDate value) {
        return value == null ? "" : value.format(DATE_FORMATTER);
    }

    private double decimal(BigDecimal value) {
        return value == null ? 0d : value.doubleValue();
    }

    private String s(String value) {
        return value == null ? "" : value;
    }
}