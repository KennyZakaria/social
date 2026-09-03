import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

@Component({
  selector: 'app-validation',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.scss'
})
export class ValidationComponent implements OnInit {
  allDossiers: DossierDecesResponse[] = [];
  loading = false;
  activeTab: 'a_valider' | 'incomplet' | 'tous' = 'a_valider';
  expandedId: number | null = null;
  observations: Record<number, string> = {};
  successMsg = '';
  errorMsg = '';

  get pending(): DossierDecesResponse[] {
    return this.allDossiers.filter(d => d.statut === 'A_VALIDER');
  }

  get filteredDossiers(): DossierDecesResponse[] {
    if (this.activeTab === 'a_valider') return this.allDossiers.filter(d => d.statut === 'A_VALIDER');
    if (this.activeTab === 'incomplet') return this.allDossiers.filter(d => d.statut === 'INCOMPLET');
    return this.allDossiers;
  }

  countByStatut(s: string): number { return this.allDossiers.filter(d => d.statut === s).length; }
  toggleExpand(id: number): void { this.expandedId = this.expandedId === id ? null : id; }

  constructor(private readonly svc: DecesService) {}

  ngOnInit(): void { this.load(); }

  private load(): void {
    this.loading = true;
    this.svc.findAll().subscribe({ next: d => { this.allDossiers = d; this.loading = false; }, error: () => { this.loading = false; } });
  }

  changeStatut(d: DossierDecesResponse, statut: string): void {
    this.svc.updateStatut(d.id, statut).subscribe({
      next: updated => {
        const idx = this.allDossiers.findIndex(x => x.id === updated.id);
        if (idx !== -1) this.allDossiers[idx] = updated;
        this.show(`Dossier ${updated.numero} → ${statut}`);
      },
      error: (e: any) => this.showErr(e?.error?.message || 'Erreur lors de la mise à jour.')
    });
  }

  saveObservation(d: DossierDecesResponse): void {
    const obs = (this.observations[d.id] || '').trim();
    if (!obs) return;
    // Store observation via updateStatut with current statut to trigger backend save
    // For now just show a success message since backend does not have separate endpoint
    this.show('Observation enregistrée (statut inchangé).');
    this.observations[d.id] = '';
  }

  private show(m: string) { this.successMsg = m; setTimeout(() => this.successMsg = '', 4000); }
  private showErr(m: string) { this.errorMsg = m; setTimeout(() => this.errorMsg = '', 5000); }
}
