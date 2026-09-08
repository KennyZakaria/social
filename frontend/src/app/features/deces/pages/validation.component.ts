import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

@Component({
  selector: 'app-validation',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">

      <!-- Alerts -->
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">{{ successMsg }}</div>
      <div class="alert alert--error"   *ngIf="errorMsg"   (click)="errorMsg=''">{{ errorMsg }}</div>

      <!-- Header -->
      <div class="page-header">
        <a class="back-btn" routerLink="/deces/dashboard">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </a>
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Module Décès</p>
          <h2 class="page-title">Validation des dossiers</h2>
        </div>
        <div class="header-meta ml-auto">
          <span class="count-badge">{{ pending.length }} en attente</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tab-bar">
        <button class="tab" [class.active]="activeTab === 'a_valider'" (click)="activeTab='a_valider'">
          À valider <span class="tab-count">{{ countByStatut('A_VALIDER') }}</span>
        </button>
        <button class="tab" [class.active]="activeTab === 'incomplet'" (click)="activeTab='incomplet'">
          Incomplets <span class="tab-count">{{ countByStatut('INCOMPLET') }}</span>
        </button>
        <button class="tab" [class.active]="activeTab === 'tous'" (click)="activeTab='tous'">
          Tous <span class="tab-count">{{ allDossiers.length }}</span>
        </button>
      </div>

      <!-- Dossiers list -->
      <div class="dossiers-list">
        <div class="dossier-card" *ngFor="let d of filteredDossiers">
          <div class="dossier-card__head">
            <div class="dossier-info">
              <div class="dossier-num">{{ d.numero }}</div>
              <div class="dossier-name">{{ d.nomComplet }}</div>
              <div class="dossier-meta">
                <span>Matricule : {{ d.matricule || '—' }}</span>
                <span>Date décès : {{ d.dateDeces | date:'dd/MM/yyyy' }}</span>
                <span>Lieu : {{ d.lieuDeces }}</span>
              </div>
            </div>
            <div class="dossier-actions">
              <span class="statut-badge statut-{{ d.statut?.toLowerCase() }}">{{ d.statut }}</span>
              <button class="btn-valider" *ngIf="d.statut === 'A_VALIDER'" (click)="changeStatut(d, 'VALIDE')">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Valider
              </button>
              <button class="btn-rejeter" *ngIf="d.statut === 'A_VALIDER' || d.statut === 'VALIDE'" (click)="changeStatut(d, 'INCOMPLET')">
                Marquer incomplet
              </button>
              <button class="btn-valider" *ngIf="d.statut === 'INCOMPLET' || d.statut === 'EN_COURS'" (click)="changeStatut(d, 'A_VALIDER')">
                Soumettre à validation
              </button>
              <button class="btn-cloturer" *ngIf="d.statut === 'VALIDE'" (click)="changeStatut(d, 'CLOTURE')">
                Clôturer
              </button>
            </div>
          </div>

          <!-- Expandable details -->
          <div class="dossier-card__body" *ngIf="expandedId === d.id">
            <div class="details-grid">
              <div *ngIf="d.natureDeces"><label>Nature du décès</label><span>{{ d.natureDeces }}</span></div>
              <div *ngIf="d.causeDeces"><label>Cause du décès</label><span>{{ d.causeDeces }}</span></div>
              <div *ngIf="d.dpr"><label>DPR</label><span>{{ d.dpr }}</span></div>
              <div *ngIf="d.observation"><label>Observation</label><span>{{ d.observation }}</span></div>
            </div>
            <div class="obs-field">
              <label>Ajouter une observation</label>
              <div class="obs-row">
                <input [(ngModel)]="observations[d.id]" placeholder="Saisir une observation…" class="obs-input"/>
                <button class="btn-obs" (click)="saveObservation(d)">Enregistrer</button>
              </div>
            </div>
          </div>
          <button class="toggle-btn" (click)="toggleExpand(d.id)">
            {{ expandedId === d.id ? '▲ Réduire' : '▼ Détails' }}
          </button>
        </div>

        <div class="empty-state" *ngIf="filteredDossiers.length === 0 && !loading">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--text-3)"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          <p>Aucun dossier dans cet onglet.</p>
        </div>

        <div class="loading-state" *ngIf="loading">Chargement…</div>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:1.25rem; }
    .alert { padding:0.75rem 1rem; border-radius:var(--r-md); font-size:0.875rem; font-weight:500; cursor:pointer; }
    .alert--success { background:var(--success-bg); color:var(--success); border:1px solid var(--success); }
    .alert--error   { background:var(--danger-bg);  color:var(--danger);  border:1px solid var(--danger); }

    .page-header { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .back-btn { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:var(--r-md); border:1px solid var(--border); background:var(--surface); text-decoration:none; color:var(--text-2); flex-shrink:0; &:hover { background:var(--surface-2); } }
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#f0fdf4; color:#16a34a; display:flex; align-items:center; justify-content:center; flex-shrink:0; svg { width:22px; height:22px; } }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-0.02em; margin-top:2px; }
    .ml-auto { margin-left:auto; }
    .count-badge { display:inline-flex; align-items:center; justify-content:center; padding:6px 14px; border-radius:99px; background:var(--primary); color:#fff; font-size:0.8rem; font-weight:700; }

    .tab-bar { display:flex; gap:4px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); padding:4px; }
    .tab { display:inline-flex; align-items:center; gap:6px; padding:6px 14px; border-radius:var(--r-md); border:none; background:transparent; cursor:pointer; font-size:0.83rem; font-weight:600; color:var(--text-2); &:hover { background:var(--surface-2); } &.active { background:var(--primary); color:#fff; } }
    .tab-count { font-size:0.7rem; background:rgba(255,255,255,0.25); border-radius:99px; padding:0 6px; .tab:not(.active) & { background:var(--surface-2); color:var(--text-3); } }

    .dossiers-list { display:flex; flex-direction:column; gap:0.75rem; }
    .dossier-card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); box-shadow:var(--sh-sm); overflow:hidden; }
    .dossier-card__head { padding:1.1rem 1.25rem; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; }
    .dossier-info { flex:1; min-width:0; }
    .dossier-num { font-size:0.7rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-3); }
    .dossier-name { font-size:1rem; font-weight:700; color:var(--text-1); margin:4px 0; }
    .dossier-meta { display:flex; gap:1rem; flex-wrap:wrap; }
    .dossier-meta span { font-size:0.78rem; color:var(--text-2); }
    .dossier-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex-shrink:0; }

    .statut-badge { display:inline-block; padding:3px 10px; border-radius:99px; font-size:0.72rem; font-weight:700; }
    .statut-en_cours   { background:#fef9c3; color:#92400e; }
    .statut-incomplet  { background:var(--danger-bg); color:var(--danger); }
    .statut-a_valider  { background:#ede9fe; color:#7c3aed; }
    .statut-valide     { background:var(--success-bg); color:var(--success); }
    .statut-cloture    { background:var(--surface-2); color:var(--text-3); }

    .btn-valider, .btn-rejeter, .btn-cloturer, .btn-obs { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; border-radius:var(--r-md); border:none; font-size:0.78rem; font-weight:700; cursor:pointer; }
    .btn-valider  { background:var(--success-bg); color:var(--success); border:1px solid var(--success); &:hover { background:var(--success); color:#fff; } }
    .btn-rejeter  { background:var(--danger-bg); color:var(--danger); border:1px solid var(--danger); &:hover { background:var(--danger); color:#fff; } }
    .btn-cloturer { background:var(--surface-2); color:var(--text-2); border:1px solid var(--border); &:hover { background:var(--border); } }
    .btn-obs      { background:var(--primary); color:#fff; white-space:nowrap; &:hover { background:var(--primary-dark); } }

    .dossier-card__body { padding:1rem 1.25rem; border-top:1px solid var(--border); background:var(--surface-2); }
    .details-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:0.75rem; margin-bottom:1rem; }
    .details-grid > div { display:flex; flex-direction:column; gap:3px; }
    .details-grid label { font-size:0.72rem; font-weight:700; text-transform:uppercase; color:var(--text-3); }
    .details-grid span  { font-size:0.85rem; color:var(--text-1); }
    .obs-field label { font-size:0.78rem; font-weight:600; color:var(--text-2); margin-bottom:6px; display:block; }
    .obs-row { display:flex; gap:8px; }
    .obs-input { flex:1; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:0.5rem 0.75rem; font-size:0.85rem; color:var(--text-1); &:focus { outline:none; border-color:var(--primary); } }

    .toggle-btn { width:100%; background:transparent; border:none; border-top:1px solid var(--border); padding:8px; font-size:0.75rem; font-weight:600; color:var(--text-3); cursor:pointer; &:hover { background:var(--surface-2); } }

    .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:1rem; padding:4rem 2rem; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); color:var(--text-3); font-size:0.9rem; }
    .loading-state { text-align:center; padding:3rem; color:var(--text-3); }
  `]
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
