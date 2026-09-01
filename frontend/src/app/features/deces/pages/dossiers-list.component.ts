import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

const STATUT_LABELS: Record<string, string> = {
  EN_COURS: 'En cours', INCOMPLET: 'Incomplet',
  A_VALIDER: 'À valider', VALIDE: 'Validé', CLOTURE: 'Clôturé'
};

@Component({
  selector: 'app-dossiers-deces-list',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">

      <!-- Alerts -->
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">{{ successMsg }}</div>
      <div class="alert alert--error"   *ngIf="errorMsg"   (click)="errorMsg=''">{{ errorMsg }}</div>

      <!-- Header -->
      <div class="page-header">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Section Décès</p>
          <h2 class="page-title">Dossiers de décès</h2>
        </div>
        <a class="btn-primary ml-auto" routerLink="/deces/nouveau">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau dossier
        </a>
      </div>

      <!-- Search + filter -->
      <div class="card">
        <div class="filter-bar">
          <div class="search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input [(ngModel)]="searchTerm" placeholder="Rechercher par numéro, nom, matricule…" class="search-input"/>
          </div>
          <select [(ngModel)]="statutFilter" class="filter-select">
            <option value="">Tous les statuts</option>
            <option *ngFor="let s of statuts" [value]="s.value">{{ s.label }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Dossiers ({{ filtered.length }})</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N° Dossier</th><th>Adhérent</th><th>Matricule</th>
                <th>Date décès</th><th>Lieu</th><th>Nature</th><th>Statut</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of filtered">
                <td class="td-mono">{{ d.numero }}</td>
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ d.nomComplet.charAt(0) }}</div>
                    <span>{{ d.nomComplet }}</span>
                  </div>
                </td>
                <td class="td-meta">{{ d.matricule || '—' }}</td>
                <td class="td-meta">{{ d.dateDeces }}</td>
                <td class="td-meta">{{ d.lieuDeces }}</td>
                <td class="td-meta">{{ d.natureDeces || '—' }}</td>
                <td>
                  <select class="statut-select" [value]="d.statut" (change)="changeStatut(d, $any($event.target).value)">
                    <option *ngFor="let s of statuts" [value]="s.value">{{ s.label }}</option>
                  </select>
                </td>
                <td>
                  <div class="actions-cell">
                    <a class="action-btn action-btn--view" title="Ayants droit" [routerLink]="['/deces/dossiers', d.id, 'ayants-droit']">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                      </svg>
                    </a>
                    <ng-container *ngIf="confirmDeleteId === d.id; else delBtn">
                      <button class="action-btn action-btn--confirm" (click)="doDelete(d.id)">Confirmer</button>
                      <button class="action-btn action-btn--cancel" (click)="confirmDeleteId = null">Annuler</button>
                    </ng-container>
                    <ng-template #delBtn>
                      <button class="action-btn action-btn--danger" title="Supprimer" (click)="confirmDeleteId = d.id">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                        </svg>
                      </button>
                    </ng-template>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0">
                <td colspan="8" class="empty-row">{{ loading ? 'Chargement…' : 'Aucun dossier.' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:1.25rem; }
    .alert { padding:0.75rem 1rem; border-radius:var(--r-md); font-size:0.875rem; font-weight:500; cursor:pointer; }
    .alert--success { background:var(--success-bg); color:var(--success); border:1px solid var(--success); }
    .alert--error   { background:var(--danger-bg);  color:var(--danger);  border:1px solid var(--danger); }
    .page-header { display:flex; align-items:center; gap:1rem; }
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#fef2f2; color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; svg { width:22px; height:22px; } }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-0.02em; margin-top:2px; }
    .ml-auto { margin-left:auto; }

    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
    .card__title { font-size:0.95rem; font-weight:700; color:var(--text-1); }

    .filter-bar { display:flex; align-items:center; gap:0.875rem; padding:0.875rem 1.25rem; flex-wrap:wrap; }
    .search-wrap { display:flex; align-items:center; gap:8px; flex:1; min-width:220px; color:var(--text-3); }
    .search-input { flex:1; border:none; outline:none; background:transparent; font-size:0.9rem; color:var(--text-1); }
    .filter-select { border:1px solid var(--border); border-radius:var(--r-md); background:var(--surface); padding:0.4rem 0.75rem; font-size:0.82rem; color:var(--text-1); }

    .btn-primary { display:inline-flex; align-items:center; gap:6px; background:var(--primary); color:#fff; border:none; border-radius:var(--r-md); padding:0.65rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; &:hover { background:var(--primary-dark); } }

    .table-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead { background:var(--surface-2); }
    th { text-align:left; padding:0.7rem 1rem; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-3); border-bottom:1px solid var(--border); white-space:nowrap; }
    td { padding:0.75rem 1rem; border-bottom:1px solid var(--border); vertical-align:middle; }
    tbody tr:hover { background:var(--surface-2); }
    tbody tr:last-child td { border-bottom:none; }

    .name-cell { display:flex; align-items:center; gap:8px; }
    .avatar { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#dc2626,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#fff; flex-shrink:0; }
    .td-mono { font-family:monospace; font-size:0.82rem; color:var(--primary); font-weight:700; }
    .td-meta { font-size:0.82rem; color:var(--text-2); }

    .statut-select { border:1px solid var(--border); border-radius:var(--r-md); background:var(--surface); padding:3px 8px; font-size:0.75rem; font-weight:600; cursor:pointer; }

    .actions-cell { display:flex; align-items:center; gap:5px; }
    .action-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:var(--r-md); border:1px solid var(--border); background:var(--surface); cursor:pointer; color:var(--text-2); text-decoration:none; }
    .action-btn--view    { &:hover { background:var(--primary-light); border-color:var(--primary); color:var(--primary); } }
    .action-btn--danger  { &:hover { background:var(--danger-bg); border-color:var(--danger); color:var(--danger); } }
    .action-btn--confirm { width:auto; padding:0 8px; font-size:0.72rem; font-weight:700; background:var(--danger); border-color:var(--danger); color:#fff; &:hover { opacity:0.85; } }
    .action-btn--cancel  { width:auto; padding:0 8px; font-size:0.72rem; font-weight:700; &:hover { background:var(--surface-2); } }

    .empty-row { text-align:center; color:var(--text-3); padding:2.5rem; }
  `]
})
export class DossiersListComponent implements OnInit {
  dossiers: DossierDecesResponse[] = [];
  loading = false;
  searchTerm = '';
  statutFilter = '';
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

  get filtered(): DossierDecesResponse[] {
    const q = this.searchTerm.toLowerCase();
    return this.dossiers.filter(d =>
      (!q || d.numero.toLowerCase().includes(q) || d.nomComplet.toLowerCase().includes(q) || (d.matricule || '').toLowerCase().includes(q)) &&
      (!this.statutFilter || d.statut === this.statutFilter)
    );
  }

  constructor(private readonly svc: DecesService) {}

  ngOnInit(): void { this.load(); }

  changeStatut(d: DossierDecesResponse, statut: string): void {
    this.svc.updateStatut(d.id, statut).subscribe({
      next: (updated) => { d.statut = updated.statut; this.show('Statut mis à jour.'); },
      error: () => this.showErr('Erreur lors de la mise à jour du statut.')
    });
  }

  doDelete(id: number): void {
    this.svc.delete(id).subscribe({
      next: () => { this.confirmDeleteId = null; this.load(); this.show('Dossier supprimé.'); },
      error: () => { this.confirmDeleteId = null; this.showErr('Erreur lors de la suppression.'); }
    });
  }

  private load(): void {
    this.loading = true;
    this.svc.findAll().subscribe({ next: d => { this.dossiers = d; this.loading = false; }, error: () => { this.loading = false; } });
  }
  private show(m: string) { this.successMsg = m; setTimeout(() => this.successMsg = '', 4000); }
  private showErr(m: string) { this.errorMsg = m; setTimeout(() => this.errorMsg = '', 5000); }
}
