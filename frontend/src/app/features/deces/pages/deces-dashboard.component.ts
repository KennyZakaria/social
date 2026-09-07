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
  template: `
    <div class="page">

      <!-- Header -->
      <div class="page-header">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Section Décès</p>
          <h2 class="page-title">Tableau de bord</h2>
        </div>
        <button class="btn-primary ml-auto" routerLink="/deces/nouveau">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouveau dossier
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon--blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          </div>
          <div class="stat-body">
            <p class="stat-label">Total dossiers</p>
            <p class="stat-value">{{ stats.total }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="stat-body">
            <p class="stat-label">En cours</p>
            <p class="stat-value">{{ stats.enCours }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="stat-body">
            <p class="stat-label">Incomplets</p>
            <p class="stat-value">{{ stats.incomplets }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div class="stat-body">
            <p class="stat-label">À valider</p>
            <p class="stat-value">{{ stats.aValider }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div class="stat-body">
            <p class="stat-label">Validés</p>
            <p class="stat-value">{{ stats.valides }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon--slate">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div class="stat-body">
            <p class="stat-label">Clôturés</p>
            <p class="stat-value">{{ stats.clotures }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation cards -->
      <div class="nav-grid">
        <a class="nav-card" routerLink="/deces/dossiers">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
          </svg>
          <span>Tous les dossiers</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
        <a class="nav-card" routerLink="/deces/validation">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span>Validation</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
        <a class="nav-card" routerLink="/deces/demandes">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
          </svg>
          <span>Demandes</span>
          <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </a>
      </div>

      <!-- Recent dossiers -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Derniers dossiers</p>
          <a class="btn-ghost" routerLink="/deces/dossiers">Voir tous</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>N° Dossier</th><th>Adhérent</th><th>Date décès</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let d of recent">
                <td class="td-mono">{{ d.numero }}</td>
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ d.nomComplet.charAt(0) }}</div>
                    <span>{{ d.nomComplet }}</span>
                  </div>
                </td>
                <td>{{ d.dateDeces }}</td>
                <td><span class="stat-badge" [class]="getStatutClass(d.statut)">{{ getStatutLabel(d.statut) }}</span></td>
                <td>
                  <button class="action-btn" title="Voir" [routerLink]="['/deces/dossiers', d.id, 'ayants-droit']">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                </td>
              </tr>
              <tr *ngIf="recent.length === 0">
                <td colspan="5" class="empty-row">{{ loading ? 'Chargement…' : 'Aucun dossier.' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:1.25rem; }
    .page-header { display:flex; align-items:center; gap:1rem; }
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#fef2f2; color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; svg { width:22px; height:22px; } }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-0.02em; margin-top:2px; }
    .ml-auto { margin-left:auto; }

    /* Stats */
    .stats-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:0.875rem; }
    .stat-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1rem; display:flex; align-items:center; gap:0.875rem; box-shadow:var(--sh-sm); }
    .stat-icon { width:40px; height:40px; border-radius:var(--r-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; svg { width:18px; height:18px; } }
    .stat-icon--blue   { background:#eff6ff; color:#2563eb; }
    .stat-icon--amber  { background:#fffbeb; color:#d97706; }
    .stat-icon--red    { background:#fef2f2; color:#dc2626; }
    .stat-icon--purple { background:#faf5ff; color:#7c3aed; }
    .stat-icon--green  { background:var(--success-bg); color:var(--success); }
    .stat-icon--slate  { background:var(--surface-2); color:var(--text-2); }
    .stat-label { font-size:0.72rem; font-weight:600; color:var(--text-3); text-transform:uppercase; letter-spacing:0.05em; }
    .stat-value { font-size:1.5rem; font-weight:800; letter-spacing:-0.03em; color:var(--text-1); margin-top:2px; }

    /* Nav cards */
    .nav-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.875rem; }
    .nav-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:1rem 1.25rem; display:flex; align-items:center; gap:10px; text-decoration:none; color:var(--text-1); font-size:0.9rem; font-weight:600; box-shadow:var(--sh-sm); transition:border-color 0.15s, background 0.15s; svg:first-child { color:var(--primary); flex-shrink:0; } .arrow { color:var(--text-3); margin-left:auto; } &:hover { border-color:var(--primary); background:var(--primary-light); } }

    /* Card */
    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
    .card__title { font-size:0.95rem; font-weight:700; color:var(--text-1); }

    /* Buttons */
    .btn-primary { display:inline-flex; align-items:center; gap:6px; background:var(--primary); color:#fff; border:none; border-radius:var(--r-md); padding:0.65rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; transition:background 0.15s; &:hover { background:var(--primary-dark); } }
    .btn-ghost { display:inline-flex; align-items:center; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:var(--r-md); padding:0.4rem 0.85rem; font-size:0.8rem; font-weight:600; cursor:pointer; text-decoration:none; &:hover { background:var(--surface-2); } }
    .action-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:var(--r-md); border:1px solid var(--border); background:var(--surface); cursor:pointer; color:var(--text-2); &:hover { background:var(--primary-light); border-color:var(--primary); color:var(--primary); } }

    /* Table */
    .table-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead { background:var(--surface-2); }
    th { text-align:left; padding:0.7rem 1rem; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-3); border-bottom:1px solid var(--border); white-space:nowrap; }
    td { padding:0.75rem 1rem; border-bottom:1px solid var(--border); vertical-align:middle; &:last-child { border-bottom:none; } }
    tbody tr:hover { background:var(--surface-2); }
    tbody tr:last-child td { border-bottom:none; }

    .name-cell { display:flex; align-items:center; gap:8px; }
    .avatar { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#dc2626,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#fff; flex-shrink:0; }
    .td-mono { font-family:monospace; font-size:0.82rem; color:var(--primary); font-weight:700; }

    .stat-badge { display:inline-block; padding:2px 10px; border-radius:99px; font-size:0.72rem; font-weight:700; }
    .badge--en-cours  { background:#fffbeb; color:#d97706; }
    .badge--incomplet { background:#fef2f2; color:#dc2626; }
    .badge--a-valider { background:#faf5ff; color:#7c3aed; }
    .badge--valide    { background:var(--success-bg); color:var(--success); }
    .badge--cloture   { background:var(--surface-2); color:var(--text-3); }

    .empty-row { text-align:center; color:var(--text-3); padding:2rem; }

    @media (max-width:1200px) { .stats-grid { grid-template-columns:repeat(3,1fr); } }
    @media (max-width:900px)  { .stats-grid { grid-template-columns:repeat(2,1fr); } .nav-grid { grid-template-columns:1fr; } }
  `]
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

  getStatutLabel(s: string): string { return STATUT_LABELS[s] ?? s; }
  getStatutClass(s: string): string {
    const map: Record<string, string> = { EN_COURS: 'badge--en-cours', INCOMPLET: 'badge--incomplet', A_VALIDER: 'badge--a-valider', VALIDE: 'badge--valide', CLOTURE: 'badge--cloture' };
    return map[s] ?? '';
  }
}
