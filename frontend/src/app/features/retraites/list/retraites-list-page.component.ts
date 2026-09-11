import { SimpleDatePipe } from '../record/simple-date.pipe';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';
import { RetraitesExportService } from '../services/retraites-export.service';

@Component({
  selector: 'app-retraites-list-page', imports: [SimpleDatePipe, CommonModule, FormsModule],
  templateUrl: './retraites-list-page.component.html',
  styleUrl: './retraites-list-page.component.css'
})
export class RetraitesListPageComponent {
  readonly pageSize = 7;
  page = 1;
  query = ''; filter: '' | RetraiteDossier['statut'] = ''; dossiers: RetraiteDossier[] = [];
  constructor(readonly store: RetraitesStoreService, private readonly router: Router, private readonly exporter: RetraitesExportService) { this.store.list().subscribe({ next: rows => this.dossiers = rows }); }
  get filtered() { const q = this.query.toLowerCase(); return this.dossiers.filter(d => (!q || `${d.reference} ${d.nom} ${d.matricule}`.toLowerCase().includes(q)) && (!this.filter || this.statusOf(d) === this.filter)); }
  get pageCount(): number { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }
  get pageNumbers(): number[] { return Array.from({ length: this.pageCount }, (_, index) => index + 1); }
  get pagedDossiers(): RetraiteDossier[] {
    const currentPage = Math.min(this.page, this.pageCount);
    const start = (currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }
  get firstShown(): number { return this.filtered.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get lastShown(): number { return Math.min(this.page * this.pageSize, this.filtered.length); }
  resetPage(): void { this.page = 1; }
  previousPage(): void { this.page = Math.max(1, this.page - 1); }
  nextPage(): void { this.page = Math.min(this.pageCount, this.page + 1); }
  goToPage(page: number): void { this.page = Math.min(Math.max(1, page), this.pageCount); }
  count(status: RetraiteDossier['statut']) { return this.dossiers.filter(d => this.statusOf(d) === status).length; }
  adherentStatusOf(dossier: RetraiteDossier): string {
    const profile = dossier.details?.profile;
    if (profile?.['dateDeces']) return 'Décédé';
    const value = String(profile?.['situationCategorie'] ?? '').trim();
    const key = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[\s-]+/g, '_');
    const labels: Record<string, string> = {
      EN_ACTIVITE: 'Actif', ACTIF: 'Actif', RETRAITE: 'Retraité',
      DECEDE: 'Décédé', DECES: 'Décédé', RADIE: 'Radié', REFORME: 'Réformé'
    };
    return labels[key] ?? (value || 'Non renseigné');
  }
  statusOf(dossier: RetraiteDossier): RetraiteDossier['statut'] { return dossier.cloture ? 'Validé' : dossier.statut; }
  isValidated(dossier: RetraiteDossier): boolean { return this.statusOf(dossier) === 'Validé'; }
  lastUpdate(dossier: RetraiteDossier): string { return dossier.miseAJour || new Date().toLocaleDateString('fr-FR'); }
  validate(_id: number) { this.router.navigate(['/retraites/validation']); }
  newDossier() { this.router.navigate(['/retraites/nouveau']); }
  open(d: RetraiteDossier) { this.router.navigate(['/module/retraites/dossier', d.id]); }
  export(dossier: RetraiteDossier): void { if (this.store.isClosed(dossier)) this.exporter.export(dossier); }
}
