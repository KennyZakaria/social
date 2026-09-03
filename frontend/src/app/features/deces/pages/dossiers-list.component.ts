import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

@Component({
  selector: 'app-dossiers-deces-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dossiers-list.component.html',
  styleUrl: './dossiers-list.component.scss'
})
export class DossiersListComponent implements OnInit {
  dossiers: DossierDecesResponse[] = [];
  loading = false;
  searchTerm = '';
  confirmDeleteId: number | null = null;
  successMsg = '';
  errorMsg = '';

  readonly statuts = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'INCOMPLET', label: 'Incomplet' },
    { value: 'A_VALIDER', label: 'À valider' },
    { value: 'VALIDE', label: 'Validé' },
    { value: 'CLOTURE', label: 'Clôturé' },
  ];

  get hasSearched(): boolean {
    return this.searchTerm.trim().length > 0;
  }

  get filtered(): DossierDecesResponse[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return [];
    return this.dossiers.filter(d =>
      d.numero.toLowerCase().includes(q) ||
      d.nomComplet.toLowerCase().includes(q) ||
      (d.matricule || '').toLowerCase().includes(q)
    );
  }

  constructor(private readonly svc: DecesService, private readonly router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  openAyants(dossier: DossierDecesResponse): void {
    this.router.navigate(['/deces/ayants-droit'], { queryParams: { adherentId: dossier.adherentId } });
  }

  changeStatut(d: DossierDecesResponse, statut: string): void {
    this.svc.updateStatut(d.id, statut).subscribe({
      next: (updated) => {
        d.statut = updated.statut;
        this.show('Statut mis à jour.');
      },
      error: () => this.showErr('Erreur lors de la mise à jour du statut.')
    });
  }

  doDelete(id: number): void {
    this.svc.delete(id).subscribe({
      next: () => {
        this.confirmDeleteId = null;
        this.load();
        this.show('Dossier supprimé.');
      },
      error: () => {
        this.confirmDeleteId = null;
        this.showErr('Erreur lors de la suppression.');
      }
    });
  }

  private load(): void {
    this.loading = true;
    this.svc.findAll().subscribe({
      next: d => { this.dossiers = d; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  private show(m: string) {
    this.successMsg = m;
    setTimeout(() => this.successMsg = '', 4000);
  }

  private showErr(m: string) {
    this.errorMsg = m;
    setTimeout(() => this.errorMsg = '', 5000);
  }
}