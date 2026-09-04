import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { FicheAssistance, FicheAssurance, FicheLiquidation, FichePension, FicheRenseignementsDeces, FicheRenseignementsDecesRequest } from '../../../models';

@Component({
  selector: 'app-fiche-renseignements-deces',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './fiche-renseignements-deces.component.html',
  styleUrl: './fiche-renseignements-deces.component.scss'
})
export class FicheRenseignementsDecesComponent implements OnInit {
  fiche: FicheRenseignementsDeces | null = null;
  draft: FicheRenseignementsDeces | null = null;
  loading = true;
  editing = false;
  saving = false;
  error = '';
  success = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly deces: DecesService) {}
  get dossierId(): number { return Number(this.route.snapshot.paramMap.get('id')); }
  get view(): FicheRenseignementsDeces | null { return this.editing ? this.draft : this.fiche; }

  ngOnInit(): void { this.load(); }
  load(): void {
    if (!this.dossierId) { this.router.navigate(['/deces/dossiers']); return; }
    this.loading = true;
    this.deces.getFiche(this.dossierId).subscribe({
      next: fiche => { this.fiche = fiche; this.draft = this.clone(fiche); this.loading = false; },
      error: () => { this.error = 'Impossible de charger la fiche de renseignements.'; this.loading = false; }
    });
  }
  startEdit(): void { if (this.fiche) { this.draft = this.clone(this.fiche); this.editing = true; } }
  cancelEdit(): void { this.draft = this.fiche ? this.clone(this.fiche) : null; this.editing = false; }
  save(): void {
    if (!this.draft) return;
    this.saving = true;
    const f = this.draft;
    const payload: FicheRenseignementsDecesRequest = {
      observation: f.observation, liquidations: f.liquidations, pensions: f.pensions, assurances: f.assurances,
      situationFinanciere: this.financialInput(f), assistancesOctroyees: f.assistancesOctroyees
    };
    this.deces.updateFiche(this.dossierId, payload).subscribe({
      next: saved => { this.fiche = saved; this.draft = this.clone(saved); this.editing = false; this.saving = false; this.success = 'Fiche enregistrée.'; },
      error: e => { this.error = e?.error?.message || 'Enregistrement impossible.'; this.saving = false; }
    });
  }
  addLiquidation(): void { this.draft?.liquidations.push({ designation: 'FRATERNELLE', montant: 0 }); }
  addPension(): void { this.draft?.pensions.push({ typeBeneficiaire: 'VEUVE_VEUF', montant: 0 }); }
  addAssurance(): void { this.draft?.assurances.push({ typeBeneficiaire: 'VEUVE_VEUF', montant: 0 }); }
  addAssistance(): void { this.draft?.assistancesOctroyees.push({ designation: 'SECOURS', montant: 0 }); }
  remove<T>(items: T[], index: number): void { items.splice(index, 1); }
  preview(): void { window.print(); }
  exportPdf(): void {
    this.deces.exportFichePdf(this.dossierId).subscribe({ next: blob => { const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = `fiche-deces-${this.fiche?.numeroDossier || this.dossierId}.pdf`; link.click(); URL.revokeObjectURL(url); }, error: () => this.error = 'Export PDF impossible.' });
  }
  totalResources(): number { const s = this.view?.situationFinanciere; return s ? this.num(s.pmr) + this.num(s.pmi) + this.num(s.salaire) + this.num(s.autresRessources) : 0; }
  totalCharges(): number { const s = this.view?.situationFinanciere; return s ? this.num(s.eauElectricite) + this.num(s.fraisMedicaux) + this.num(s.fraisScolarite) + this.num(s.loyer) + this.num(s.autresCharges) : 0; }
  private financialInput(f: FicheRenseignementsDeces) { const s = f.situationFinanciere; return { pmr: this.num(s.pmr), pmi: this.num(s.pmi), salaire: this.num(s.salaire), autresRessources: this.num(s.autresRessources), eauElectricite: this.num(s.eauElectricite), fraisMedicaux: this.num(s.fraisMedicaux), fraisScolarite: this.num(s.fraisScolarite), loyer: this.num(s.loyer), autresCharges: this.num(s.autresCharges) }; }
  private num(value: number | null | undefined): number { return Number(value) || 0; }
  private clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }
}