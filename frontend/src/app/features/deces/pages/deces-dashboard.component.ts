import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

const STATUT_LABELS: Record<string, string> = {
  EN_COURS: 'En cours', INCOMPLET: 'Incomplet',
  A_VALIDER: 'À valider', VALIDE: 'Validé', CLOTURE: 'Clôturé'
};

@Component({
  selector: 'app-deces-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './deces-dashboard.component.html',
  styleUrl: './deces-dashboard.component.scss'
})
export class DecesDashboardComponent implements OnInit {
  dossiers: DossierDecesResponse[] = [];
  loading = false;

  get recent() { return this.dossiers.slice(0, 5); }

  get stats() {
    return {
      total:      this.dossiers.length,
      enCours:    this.dossiers.filter(d => d.statut === 'EN_COURS').length,
      incomplets: this.dossiers.filter(d => d.statut === 'INCOMPLET').length,
      aValider:   this.dossiers.filter(d => d.statut === 'A_VALIDER').length,
      valides:    this.dossiers.filter(d => d.statut === 'VALIDE').length,
      clotures:   this.dossiers.filter(d => d.statut === 'CLOTURE').length,
    };
  }

  constructor(private readonly svc: DecesService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loading = true;
    this.svc.findAll().subscribe({ next: d => { this.dossiers = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  openAyants(dossier: DossierDecesResponse): void {
    this.router.navigate(['/deces/ayants-droit'], { queryParams: { adherentId: dossier.adherentId } });
  }

  getStatutLabel(s: string): string { return STATUT_LABELS[s] ?? s; }
  getStatutClass(s: string): string {
    const map: Record<string, string> = { EN_COURS: 'badge--en-cours', INCOMPLET: 'badge--incomplet', A_VALIDER: 'badge--a-valider', VALIDE: 'badge--valide', CLOTURE: 'badge--cloture' };
    return map[s] ?? '';
  }
}
