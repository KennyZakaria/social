package com.social.servicesocial.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.social.servicesocial.dto.FicheRenseignementsDecesResponse;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FicheRenseignementsPdfService {
    private final FicheRenseignementsDecesService ficheService;

    public byte[] export(Long dossierId) {
        FicheRenseignementsDecesResponse f = ficheService.get(dossierId);
        ficheService.recordExport(dossierId, "system");
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4, 32, 32, 36, 36);
            PdfWriter.getInstance(document, output);
            document.open();
            Font title = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font section = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
            document.add(new Paragraph("FICHE DE RENSEIGNEMENTS", title));
            document.add(new Paragraph("VEUVE / DECEDE EN ACTIVITE"));
            document.add(new Paragraph("Dossier : " + f.numeroDossier()));
            addSection(document, "1. IDENTIFICATION DU DECEDE", section, List.of(
                    "Nom : " + text(f.adherent().nom()), "Prenom : " + text(f.adherent().prenom()),
                    "Grade : " + text(f.adherent().grade()), "Matricule / MLE : " + text(f.adherent().matricule()),
                    "CIN : " + text(f.adherent().cin()), "Date naissance : " + text(f.adherent().dateNaissance()),
                    "Date deces : " + text(f.deces().dateDeces()), "Lieu deces : " + text(f.deces().lieuDeces()),
                    "Cause deces : " + text(f.deces().causeDeces()), "Derniere unite : " + text(f.adherent().derniereUnite()),
                    "DPR : " + text(f.deces().dpr())));
            addAyant(document, "2. VEUVE / VEUF", f.veufVeuve(), section);
            addTable(document, "3. ORPHELINS", section, List.of("Nom", "Naissance", "Situation", "Instruction", "Emploi"), f.orphelins().stream().map(a -> List.of(text(a.prenom()) + " " + text(a.nom()), text(a.dateNaissance()), text(a.situationFamiliale()), text(a.niveauInstruction()), text(a.activiteEmploi()))).toList());
            addTable(document, "4. ASCENDANTS", section, List.of("Nom", "Naissance", "Situation", "Emploi", "Adresse"), f.ascendants().stream().map(a -> List.of(text(a.prenom()) + " " + text(a.nom()), text(a.dateNaissance()), text(a.situationFamiliale()), text(a.activiteEmploi()), text(a.adresse()))).toList());
            addTable(document, "5. LIQUIDATION DES DROITS", section, List.of("Designation", "Montant", "Beneficiaire", "Reference"), f.liquidations().stream().map(x -> List.of(text(x.designation()), money(x.montant()), text(x.beneficiaire()), text(x.reference()))).toList());
            addTable(document, "6. PENSIONS", section, List.of("Type", "Numero", "Montant"), f.pensions().stream().map(x -> List.of(text(x.typeBeneficiaire()), text(x.numero()), money(x.montant()))).toList());
            addTable(document, "7. ASSURANCE", section, List.of("Type", "Cheque", "Montant"), f.assurances().stream().map(x -> List.of(text(x.typeBeneficiaire()), text(x.numeroCheque()), money(x.montant()))).toList());
            addSection(document, "8. SITUATION FINANCIERE", section, List.of("Total ressources : " + money(f.situationFinanciere().totalRessources()), "Total charges : " + money(f.situationFinanciere().totalCharges()), "Balance : " + money(f.situationFinanciere().balance())));
            addTable(document, "9. ASSISTANCE OCTROYEE", section, List.of("Designation", "Montant", "Date", "Reference"), f.assistancesOctroyees().stream().map(x -> List.of(text(x.designation()), money(x.montant()), text(x.date()), text(x.chequeReference()))).toList());
            addSection(document, "10. OBSERVATION", section, List.of(text(f.observation())));
            document.close();
            return output.toByteArray();
        } catch (Exception e) { throw new IllegalStateException("Generation du PDF impossible", e); }
    }

    private void addSection(Document d, String heading, Font font, List<String> lines) throws DocumentException { d.add(new Paragraph("\n" + heading, font)); for (String line : lines) d.add(new Paragraph(line)); }
    private void addAyant(Document d, String heading, FicheRenseignementsDecesResponse.Ayant a, Font font) throws DocumentException { addSection(d, heading, font, a == null ? List.of("Aucune information") : List.of("Nom : " + text(a.nom()), "Prenom : " + text(a.prenom()), "CIN : " + text(a.cin()), "Naissance : " + text(a.dateNaissance()), "Activite : " + text(a.activiteEmploi()), "Adresse : " + text(a.adresse()))); }
    private void addTable(Document d, String heading, Font font, List<String> headers, List<List<String>> rows) throws DocumentException { d.add(new Paragraph("\n" + heading, font)); PdfPTable table = new PdfPTable(headers.size()); table.setWidthPercentage(100); for (String h : headers) { PdfPCell cell = new PdfPCell(new Phrase(h)); cell.setBackgroundColor(new Color(230, 241, 238)); table.addCell(cell); } if (rows.isEmpty()) { PdfPCell empty = new PdfPCell(new Phrase("Aucune donnee")); empty.setColspan(headers.size()); table.addCell(empty); } else for (List<String> row : rows) for (String value : row) table.addCell(value); d.add(table); }
    private static String text(Object x) { return x == null || x.toString().isBlank() ? "-" : x.toString(); }
    private static String money(BigDecimal x) { return x == null ? "0.00" : x.setScale(2).toPlainString(); }
}