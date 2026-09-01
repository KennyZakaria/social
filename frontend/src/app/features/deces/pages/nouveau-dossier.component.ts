import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdherentsService } from '../../adherents/services/adherents.service';
import { DecesService } from '../services/deces.service';
import { AdherentResponse } from '../../../models';

@Component({
  selector: 'app-nouveau-dossier-deces',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">

      <!-- Header -->
      <div class="page-header">
        <a class="back-btn" routerLink="/deces/dossiers">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </a>
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Section Décès</p>
          <h2 class="page-title">Nouveau dossier</h2>
        </div>
      </div>

      <!-- Alert -->
      <div class="alert alert--success" *ngIf="successMsg">{{ successMsg }}</div>
      <div class="alert alert--error"   *ngIf="errorMsg">{{ errorMsg }}</div>

      <!-- Step 1: Search adherent -->
      <div class="card" *ngIf="!adherentSelectionne">
        <div class="card__head"><p class="card__title">Étape 1 — Rechercher l'adhérent</p></div>
        <div class="form-body">
          <div class="search-row">
            <div class="search-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input [(ngModel)]="rechercheAdherent" placeholder="Nom, matricule, CIN…" class="search-input" (input)="onSearchAdherent()"/>
            </div>
          </div>
          <div class="results-list" *ngIf="resultats.length > 0">
            <div class="result-item" *ngFor="let a of resultats" (click)="selectAdherent(a)">
              <div class="result-avatar">{{ a.nomAr.charAt(0) }}</div>
              <div>
                <div class="result-name">{{ a.prenomAr }} {{ a.nomAr }}</div>
                <div class="result-meta">{{ a.matricule }} · {{ a.cin }}</div>
              </div>
              <svg class="result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
          <p class="hint-text" *ngIf="rechercheAdherent && resultats.length === 0">Aucun adhérent trouvé.</p>
        </div>
      </div>

      <!-- Step 2: Form -->
      <div class="card" *ngIf="adherentSelectionne">
        <div class="card__head">
          <p class="card__title">
            Étape 2 — Informations du décès
            <span class="adherent-chip">{{ adherentSelectionne.prenomAr }} {{ adherentSelectionne.nomAr }} · {{ adherentSelectionne.matricule }}</span>
          </p>
          <button class="btn-ghost" (click)="adherentSelectionne = null">Changer d'adhérent</button>
        </div>
        <form [formGroup]="form" (ngSubmit)="submitDossier()" class="form-body">
          <div class="form-grid">
            <div class="field">
              <label>Date du décès <span class="req">*</span></label>
              <input formControlName="dateDeces" type="date"/>
            </div>
            <div class="field">
              <label>Lieu du décès <span class="req">*</span></label>
              <input formControlName="lieuDeces" placeholder="Ville, wilaya"/>
            </div>
            <div class="field">
              <label>Nature du décès</label>
              <select formControlName="natureDeces">
                <option value="">— Sélectionner —</option>
                <option>Naturelle</option>
                <option>Accidentelle</option>
                <option>Maladie</option>
                <option>Autre</option>
              </select>
            </div>
            <div class="field">
              <label>Cause du décès</label>
              <input formControlName="causeDeces" placeholder="Description"/>
            </div>
            <div class="field">
              <label>DPR</label>
              <input formControlName="dpr" placeholder="N° DPR"/>
            </div>
            <div class="field field--wide">
              <label>Observation</label>
              <textarea formControlName="observation" rows="3" placeholder="Notes complémentaires…"></textarea>
            </div>
          </div>
          <div class="form-footer">
            <button class="btn-ghost" type="button" routerLink="/deces/dossiers">Annuler</button>
            <button class="btn-primary" type="submit" [disabled]="form.invalid || loading">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/>
              </svg>
              {{ loading ? 'Enregistrement…' : 'Créer le dossier' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:1.25rem; }
    .page-header { display:flex; align-items:center; gap:1rem; }
    .back-btn { display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:var(--r-md); border:1px solid var(--border); background:var(--surface); cursor:pointer; color:var(--text-2); text-decoration:none; flex-shrink:0; &:hover { background:var(--surface-2); } }
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#fef2f2; color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; svg { width:22px; height:22px; } }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-0.02em; margin-top:2px; }

    .alert { padding:0.75rem 1rem; border-radius:var(--r-md); font-size:0.875rem; font-weight:500; }
    .alert--success { background:var(--success-bg); color:var(--success); border:1px solid var(--success); }
    .alert--error   { background:var(--danger-bg);  color:var(--danger);  border:1px solid var(--danger); }

    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
    .card__title { font-size:0.95rem; font-weight:700; color:var(--text-1); display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    .adherent-chip { font-size:0.78rem; font-weight:600; background:var(--primary-light); color:var(--primary-dark); padding:2px 10px; border-radius:99px; }

    .form-body { padding:1.25rem; display:flex; flex-direction:column; gap:1.25rem; }
    .form-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.875rem; align-items:start; }
    .field { display:flex; flex-direction:column; gap:5px; }
    .field--wide { grid-column:span 3; }
    .field label { font-size:0.78rem; font-weight:600; color:var(--text-2); }
    .req { color:var(--danger); }
    textarea { resize:vertical; }

    .search-row { display:flex; gap:0.875rem; }
    .search-wrap { display:flex; align-items:center; gap:8px; flex:1; border:1px solid var(--border); border-radius:var(--r-md); padding:0.5rem 0.875rem; color:var(--text-3); }
    .search-input { flex:1; border:none; outline:none; background:transparent; font-size:0.9rem; color:var(--text-1); }

    .results-list { display:flex; flex-direction:column; gap:4px; }
    .result-item { display:flex; align-items:center; gap:10px; padding:0.625rem 0.875rem; border:1px solid var(--border); border-radius:var(--r-md); cursor:pointer; transition:background 0.15s; &:hover { background:var(--primary-light); border-color:var(--primary); } }
    .result-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#dc2626,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#fff; flex-shrink:0; }
    .result-name { font-size:0.85rem; font-weight:600; direction:rtl; }
    .result-meta { font-size:0.73rem; color:var(--text-3); }
    .result-arrow { margin-left:auto; color:var(--text-3); }
    .hint-text { font-size:0.85rem; color:var(--text-3); text-align:center; padding:1rem 0; }

    .form-footer { display:flex; justify-content:flex-end; gap:0.75rem; }
    .btn-primary { display:inline-flex; align-items:center; gap:6px; background:var(--primary); color:#fff; border:none; border-radius:var(--r-md); padding:0.65rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer; &:hover:not(:disabled) { background:var(--primary-dark); } &:disabled { opacity:0.5; cursor:not-allowed; } }
    .btn-ghost { display:inline-flex; align-items:center; gap:6px; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:var(--r-md); padding:0.65rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer; text-decoration:none; &:hover { background:var(--surface-2); } }

    @media (max-width:900px) { .form-grid { grid-template-columns:repeat(2,1fr); } .field--wide { grid-column:span 2; } }
    @media (max-width:600px) { .form-grid { grid-template-columns:1fr; } .field--wide { grid-column:span 1; } }
  `]
})
export class NouveauDossierDecesComponent implements OnInit {
  adherentSelectionne: AdherentResponse | null = null;
  rechercheAdherent = '';
  resultats: AdherentResponse[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';
  private searchTimer: any;

  readonly form = this.fb.nonNullable.group({
    dateDeces:   ['', Validators.required],
    lieuDeces:   ['', Validators.required],
    natureDeces: [''],
    causeDeces:  [''],
    dpr:         [''],
    observation: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly adherentsSvc: AdherentsService,
    private readonly decesSvc: DecesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onSearchAdherent(): void {
    clearTimeout(this.searchTimer);
    if (!this.rechercheAdherent.trim()) { this.resultats = []; return; }
    this.searchTimer = setTimeout(() => {
      this.adherentsSvc.list(this.rechercheAdherent, 0, 10).subscribe({
        next: p => this.resultats = p.content,
        error: () => this.resultats = []
      });
    }, 300);
  }

  selectAdherent(a: AdherentResponse): void {
    this.adherentSelectionne = a;
    this.resultats = [];
  }

  submitDossier(): void {
    if (!this.adherentSelectionne) return;
    this.loading = true;
    const raw = this.form.getRawValue();
    this.decesSvc.create({
      adherentId:  this.adherentSelectionne.id,
      dateDeces:   raw.dateDeces,
      lieuDeces:   raw.lieuDeces,
      natureDeces: raw.natureDeces || undefined,
      causeDeces:  raw.causeDeces  || undefined,
      dpr:         raw.dpr         || undefined,
      observation: raw.observation || undefined,
    }).subscribe({
      next: (d) => {
        this.loading = false;
        this.router.navigate(['/deces/dossiers', d.id, 'ayants-droit']);
      },
      error: (e: any) => {
        this.loading = false;
        this.errorMsg = e?.error?.message || 'Erreur lors de la création du dossier.';
        setTimeout(() => this.errorMsg = '', 5000);
      }
    });
  }
}
