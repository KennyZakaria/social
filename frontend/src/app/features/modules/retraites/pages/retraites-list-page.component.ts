import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';
import { RetraitesExportService } from '../services/retraites-export.service';

@Component({
  selector: 'app-retraites-list-page', imports: [CommonModule, FormsModule],
  templateUrl: './retraites-list-page.component.html',
  styleUrl: './retraites-list-page.component.css'
})
export class RetraitesListPageComponent {
  query = ''; filter: '' | RetraiteDossier['statut'] = ''; dossiers: RetraiteDossier[] = [];
  constructor(readonly store: RetraitesStoreService, private readonly router: Router, private readonly exporter: RetraitesExportService) { this.refresh(); }
  get filtered() { const q = this.query.toLowerCase(); return this.dossiers.filter(d => (!q || `${d.reference} ${d.nom} ${d.matricule}`.toLowerCase().includes(q)) && (!this.filter || this.statusOf(d) === this.filter)); }
  count(status: RetraiteDossier['statut']) { return this.dossiers.filter(d => this.statusOf(d) === status).length; }
  statusOf(dossier: RetraiteDossier): RetraiteDossier['statut'] { return dossier.cloture ? 'Validé' : dossier.statut; }
  isValidated(dossier: RetraiteDossier): boolean { return this.statusOf(dossier) === 'Validé'; }
  lastUpdate(dossier: RetraiteDossier): string { return dossier.miseAJour || new Date().toLocaleDateString('fr-FR'); }
  validate(_id: number) { this.router.navigate(['/retraites/validation']); }
  newDossier() { this.router.navigate(['/retraites/nouveau']); }
  open(d: RetraiteDossier) { this.router.navigate(['/module/retraites/dossier', d.id]); }
  export(dossier: RetraiteDossier): void { if (this.store.isClosed(dossier)) this.exporter.export(dossier); }
  private refresh() { this.dossiers = this.store.all(); }
}
