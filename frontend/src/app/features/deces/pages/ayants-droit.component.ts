import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AyantsDroitService } from '../services/ayants-droit.service';
import { DecesService } from '../services/deces.service';
import { AyantDroitResponse, DossierDecesResponse } from '../../../models';

@Component({
  selector: 'app-ayants-droit',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">

      <!-- Alerts -->
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">{{ successMsg }}</div>
      <div class="alert alert--error"   *ngIf="errorMsg"   (click)="errorMsg=''">{{ errorMsg }}</div>

      <!-- Header -->
      <div class="page-header">
        <a class="back-btn" routerLink="/deces/dossiers">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </a>
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker" *ngIf="dossier">{{ dossier.numero }} · {{ dossier.nomComplet }}</p>
          <h2 class="page-title">Ayants droit</h2>
        </div>
        <div class="ml-auto header-actions">
          <span class="pct-badge" [class.pct-ok]="totalPct === 100" [class.pct-over]="totalPct > 100" *ngIf="modeRepartition === 'POURCENTAGE'">
            {{ totalPct | number:'1.0-1' }}% / 100%
          </span>
          <button class="btn-ghost mode-btn" [class.active]="modeRepartition === 'POURCENTAGE'" (click)="modeRepartition='POURCENTAGE'">% Pourcentage</button>
          <button class="btn-ghost mode-btn" [class.active]="modeRepartition === 'CHARIA'" (click)="modeRepartition='CHARIA'">Charia</button>
          <button class="btn-primary" (click)="openNew()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Ajouter
          </button>
        </div>
      </div>

      <!-- Form -->
      <div class="card form-card" *ngIf="formOpen">
        <div class="card__head">
          <p class="card__title">{{ editingId ? 'Modifier l\'ayant droit' : 'Nouvel ayant droit' }}</p>
          <button class="btn-ghost" (click)="closeForm()">Annuler</button>
        </div>
        <form [formGroup]="form" (ngSubmit)="saveAyant()" class="form-body">
          <div class="form-grid">
            <div class="field"><label>Nom <span class="req">*</span></label><input formControlName="nom" placeholder="ALAMI"/></div>
            <div class="field"><label>Prénom <span class="req">*</span></label><input formControlName="prenom" placeholder="Fatima"/></div>
            <div class="field"><label>CIN <span class="req">*</span></label><input formControlName="cin" placeholder="AB123456"/></div>
            <div class="field">
              <label>Lien de parenté <span class="req">*</span></label>
              <select formControlName="lienParente">
                <option value="">— Sélectionner —</option>
                <option>Épouse</option><option>Époux</option><option>Fils</option><option>Fille</option>
                <option>Père</option><option>Mère</option><option>Frère</option><option>Sœur</option><option>Autre</option>
              </select>
            </div>
            <div class="field"><label>Date de naissance</label><input formControlName="dateNaissance" type="date"/></div>
            <div class="field"><label>Téléphone</label><input formControlName="telephone" placeholder="0555 000 000"/></div>
            <div class="field field--wide"><label>Adresse</label><input formControlName="adresse" placeholder="Adresse complète"/></div>
            <div class="field" *ngIf="modeRepartition === 'POURCENTAGE'">
              <label>Pourcentage (%)</label>
              <input formControlName="pourcentage" type="number" min="0" max="100" step="0.01" placeholder="25"/>
            </div>
          </div>
          <div class="form-footer">
            <button class="btn-primary" type="submit" [disabled]="form.invalid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
              {{ editingId ? 'Enregistrer' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="card__head"><p class="card__title">Ayants droit ({{ ayants.length }})</p></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nom &amp; Prénom</th><th>CIN</th><th>Lien</th><th>Téléphone</th>
                <th *ngIf="modeRepartition === 'POURCENTAGE'">%</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of ayants">
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ a.nom.charAt(0) }}</div>
                    <span class="name-text">{{ a.nom }} {{ a.prenom }}</span>
                  </div>
                </td>
                <td class="td-mono">{{ a.cin }}</td>
                <td><span class="lien-badge">{{ a.lienParente }}</span></td>
                <td class="td-meta">{{ a.telephone || '—' }}</td>
                <td class="td-pct" *ngIf="modeRepartition === 'POURCENTAGE'">
                  <span [class.pct-ok]="true">{{ a.pourcentage ?? '—' }}%</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn action-btn--edit" title="Modifier" (click)="startEdit(a)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <ng-container *ngIf="confirmDeleteId === a.id; else delBtn">
                      <button class="action-btn action-btn--confirm" (click)="doDelete(a.id)">Confirmer</button>
                      <button class="action-btn action-btn--cancel" (click)="confirmDeleteId = null">Annuler</button>
                    </ng-container>
                    <ng-template #delBtn>
                      <button class="action-btn action-btn--danger" (click)="confirmDeleteId = a.id">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                      </button>
                    </ng-template>
                  </div>
                </td>
              </tr>
              <tr *ngIf="ayants.length === 0">
                <td [attr.colspan]="modeRepartition === 'POURCENTAGE' ? 6 : 5" class="empty-row">{{ loading ? 'Chargement…' : 'Aucun ayant droit.' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Percentage total bar -->
        <div class="pct-bar-wrap" *ngIf="modeRepartition === 'POURCENTAGE' && ayants.length > 0">
          <div class="pct-bar-bg">
            <div class="pct-bar-fill" [style.width.%]="totalPct" [class.pct-over-bar]="totalPct > 100"></div>
          </div>
          <span class="pct-total" [class.pct-ok]="totalPct === 100">Total : {{ totalPct | number:'1.0-1' }}%</span>
        </div>
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
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#fef2f2; color:#dc2626; display:flex; align-items:center; justify-content:center; flex-shrink:0; svg { width:22px; height:22px; } }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-0.02em; margin-top:2px; }
    .ml-auto { margin-left:auto; }
    .header-actions { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
    .mode-btn { &.active { background:var(--primary-light); border-color:var(--primary); color:var(--primary-dark); font-weight:700; } }
    .pct-badge { font-size:0.8rem; font-weight:700; padding:3px 10px; border-radius:99px; background:var(--surface-2); color:var(--text-2); border:1px solid var(--border); &.pct-ok { background:var(--success-bg); color:var(--success); border-color:var(--success); } &.pct-over { background:var(--danger-bg); color:var(--danger); border-color:var(--danger); } }

    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:8px; }
    .card__title { font-size:0.95rem; font-weight:700; color:var(--text-1); }
    .form-card { border-left:3px solid var(--primary); }
    .form-body { padding:1.25rem; display:flex; flex-direction:column; gap:1.25rem; }
    .form-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.875rem; align-items:start; }
    .field { display:flex; flex-direction:column; gap:5px; }
    .field--wide { grid-column:span 2; }
    .field label { font-size:0.78rem; font-weight:600; color:var(--text-2); }
    .req { color:var(--danger); }
    .form-footer { display:flex; justify-content:flex-end; }

    .btn-primary { display:inline-flex; align-items:center; gap:6px; background:var(--primary); color:#fff; border:none; border-radius:var(--r-md); padding:0.65rem 1.25rem; font-size:0.875rem; font-weight:600; cursor:pointer; &:hover:not(:disabled) { background:var(--primary-dark); } &:disabled { opacity:0.5; cursor:not-allowed; } }
    .btn-ghost { display:inline-flex; align-items:center; gap:6px; background:transparent; color:var(--text-2); border:1px solid var(--border); border-radius:var(--r-md); padding:0.4rem 0.85rem; font-size:0.8rem; font-weight:600; cursor:pointer; text-decoration:none; &:hover { background:var(--surface-2); } }

    .table-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead { background:var(--surface-2); }
    th { text-align:left; padding:0.7rem 1rem; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-3); border-bottom:1px solid var(--border); white-space:nowrap; }
    td { padding:0.75rem 1rem; border-bottom:1px solid var(--border); vertical-align:middle; }
    tbody tr:hover { background:var(--surface-2); }
    tbody tr:last-child td { border-bottom:none; }

    .name-cell { display:flex; align-items:center; gap:8px; }
    .avatar { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#dc2626,#7c3aed); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; color:#fff; flex-shrink:0; }
    .name-text { font-weight:600; font-size:0.85rem; }
    .td-mono { font-family:monospace; font-size:0.82rem; }
    .td-meta { font-size:0.82rem; color:var(--text-2); }
    .td-pct { font-size:0.85rem; font-weight:700; }
    .pct-ok { color:var(--success); }
    .lien-badge { display:inline-block; padding:2px 8px; border-radius:99px; background:var(--primary-light); color:var(--primary-dark); font-size:0.72rem; font-weight:700; }

    .actions-cell { display:flex; align-items:center; gap:5px; }
    .action-btn { display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:var(--r-md); border:1px solid var(--border); background:var(--surface); cursor:pointer; color:var(--text-2); }
    .action-btn--edit    { &:hover { background:var(--primary-light); border-color:var(--primary); color:var(--primary); } }
    .action-btn--danger  { &:hover { background:var(--danger-bg); border-color:var(--danger); color:var(--danger); } }
    .action-btn--confirm { width:auto; padding:0 8px; font-size:0.72rem; font-weight:700; background:var(--danger); border-color:var(--danger); color:#fff; &:hover { opacity:0.85; } }
    .action-btn--cancel  { width:auto; padding:0 8px; font-size:0.72rem; font-weight:700; &:hover { background:var(--surface-2); } }

    .pct-bar-wrap { padding:0.875rem 1.25rem; display:flex; align-items:center; gap:1rem; border-top:1px solid var(--border); }
    .pct-bar-bg { flex:1; height:8px; border-radius:99px; background:var(--border); overflow:hidden; }
    .pct-bar-fill { height:100%; background:var(--primary); border-radius:99px; transition:width 0.3s; &.pct-over-bar { background:var(--danger); } }
    .pct-total { font-size:0.8rem; font-weight:700; white-space:nowrap; &.pct-ok { color:var(--success); } }

    .empty-row { text-align:center; color:var(--text-3); padding:2.5rem; }
    @media (max-width:900px) { .form-grid { grid-template-columns:repeat(2,1fr); } }
  `]
})
export class AyantsDroitComponent implements OnInit {
  dossierId!: number;
  dossier: DossierDecesResponse | null = null;
  ayants: AyantDroitResponse[] = [];
  loading = false;
  formOpen = false;
  editingId: number | null = null;
  confirmDeleteId: number | null = null;
  modeRepartition: 'POURCENTAGE' | 'CHARIA' = 'POURCENTAGE';
  successMsg = '';
  errorMsg = '';

  readonly form = this.fb.nonNullable.group({
    nom:           ['', Validators.required],
    prenom:        ['', Validators.required],
    cin:           ['', Validators.required],
    lienParente:   ['', Validators.required],
    dateNaissance: [''],
    telephone:     [''],
    adresse:       [''],
    pourcentage:   [null as number | null],
  });

  get totalPct(): number {
    return this.ayants.reduce((s, a) => s + (a.pourcentage ?? 0), 0);
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly svc: AyantsDroitService,
    private readonly decesSvc: DecesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dossierId = Number(this.route.snapshot.paramMap.get('id'));
    this.decesSvc.findById(this.dossierId).subscribe({ next: d => this.dossier = d });
    this.loadAyants();
  }

  openNew(): void { this.editingId = null; this.form.reset(); this.formOpen = true; }
  closeForm(): void { this.formOpen = false; this.editingId = null; this.form.reset(); }

  startEdit(a: AyantDroitResponse): void {
    this.editingId = a.id;
    this.form.patchValue({ nom: a.nom, prenom: a.prenom, cin: a.cin, lienParente: a.lienParente, dateNaissance: a.dateNaissance ?? '', telephone: a.telephone ?? '', adresse: a.adresse ?? '', pourcentage: a.pourcentage ?? null });
    this.formOpen = true;
  }

  saveAyant(): void {
    const raw = this.form.getRawValue();
    const payload = {
      nom: raw.nom, prenom: raw.prenom, cin: raw.cin, lienParente: raw.lienParente,
      dateNaissance: raw.dateNaissance || undefined,
      telephone: raw.telephone || undefined,
      adresse: raw.adresse || undefined,
      typeRepartition: this.modeRepartition,
      pourcentage: this.modeRepartition === 'POURCENTAGE' ? raw.pourcentage ?? undefined : undefined,
    } as any;

    const obs = this.editingId
      ? this.svc.update(this.dossierId, this.editingId, payload)
      : this.svc.create(this.dossierId, payload);

    obs.subscribe({
      next: () => { this.closeForm(); this.loadAyants(); this.show(this.editingId ? 'Ayant droit mis à jour.' : 'Ayant droit ajouté.'); },
      error: (e: any) => this.showErr(e?.error?.message || 'Erreur lors de l\'enregistrement.')
    });
  }

  doDelete(id: number): void {
    this.svc.delete(this.dossierId, id).subscribe({
      next: () => { this.confirmDeleteId = null; this.loadAyants(); this.show('Ayant droit supprimé.'); },
      error: (e: any) => { this.confirmDeleteId = null; this.showErr(e?.error?.message || 'Erreur lors de la suppression.'); }
    });
  }

  private loadAyants(): void {
    this.loading = true;
    this.svc.list(this.dossierId).subscribe({ next: d => { this.ayants = d; this.loading = false; }, error: () => { this.loading = false; } });
  }
  private show(m: string) { this.successMsg = m; setTimeout(() => this.successMsg = '', 4000); }
  private showErr(m: string) { this.errorMsg = m; setTimeout(() => this.errorMsg = '', 5000); }
}
