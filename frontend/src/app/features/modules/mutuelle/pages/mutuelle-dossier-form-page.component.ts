import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AdherentResponse, MutuelleDossierRequest, MutuelleDossierType } from '../../../../models';
import { MutuelleService } from '../mutuelle.service';

@Component({
  selector: 'app-mutuelle-dossier-form-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">{{ successMsg }}</div>
      <div class="alert alert--error" *ngIf="errorMsg" (click)="errorMsg=''">{{ errorMsg }}</div>

      <div class="page-header">
        <a class="back-btn" routerLink="/module/mutuelle/adherents">Retour</a>
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 9h16"/><path d="M4 15h16"/></svg>
        </div>
        <div>
          <p class="page-kicker">Section Mutuelle</p>
          <h2 class="page-title">{{ mode === 'view' ? 'Voir dossier mutuelle' : mode === 'edit' ? 'Mettre à jour dossier mutuelle' : 'Ajouter dossier mutuelle' }}</h2>
        </div>
      </div>

      <div class="card" *ngIf="adherent">
        <div class="card__head"><p class="card__title">Adhérent sélectionné</p></div>
        <div class="summary-grid">
          <div><span class="label">Nom</span><strong>{{ adherent.prenomAr }} {{ adherent.nomAr }}</strong></div>
          <div><span class="label">Grade</span><strong>{{ adherent.grade }}</strong></div>
          <div><span class="label">Matricule</span><strong>{{ adherent.matricule }}</strong></div>
          <div><span class="label">CIN</span><strong>{{ adherent.cin }}</strong></div>
          <div><span class="label">Mle BR</span><strong>{{ adherent.matriculeBR }}</strong></div>
          <div><span class="label">Unité</span><strong>{{ adherent.dernierUnite }}</strong></div>
        </div>
      </div>

      <div class="card">
        <div class="card__head"><p class="card__title">Informations courrier mutuelle</p></div>
        <form [formGroup]="form" (ngSubmit)="save()" class="form-body">
          <div class="form-grid">
            <div class="field">
              <label>Type courrier</label>
              <select formControlName="typeCourrier" [disabled]="mode === 'view'">
                <option value="INTERNE">Interne</option>
                <option value="EXTERNE">Externe</option>
              </select>
            </div>
            <div class="field"><label>N° d'ordre</label><input formControlName="numeroOrdre" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>N° d'envoi</label><input formControlName="numeroEnvoi" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Date d'envoi</label><input formControlName="dateEnvoi" type="date" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Date de réception</label><input formControlName="dateReception" type="date" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Type dossier</label>
              <select formControlName="typeDossier" [disabled]="mode === 'view'">
                <option value="ALD">ALD</option>
                <option value="NORMAL">Normal</option>
                <option value="DENTAIRE">Dentaire</option>
              </select>
            </div>
            <div class="field field--wide"><label>Désignation</label><input formControlName="designation" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Centre de soin</label><input formControlName="centreSoin" [readonly]="mode === 'view'" /></div>
            <div class="field field--wide"><label>Observation</label><input formControlName="observation" [readonly]="mode === 'view'" /></div>
          </div>
          <div class="form-footer">
            <button class="btn-ghost" type="button" (click)="goHistory()">Retour historique</button>
            <button class="btn-primary" *ngIf="mode === 'view'" type="button" (click)="switchToEdit()">Mettre à jour</button>
            <button class="btn-primary" *ngIf="mode !== 'view'" type="submit">{{ mode === 'edit' ? 'Enregistrer modifications' : 'Enregistrer' }}</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:1.25rem; }
    .alert { padding:0.75rem 1rem; border-radius:var(--r-md); font-size:0.875rem; font-weight:500; cursor:pointer; }
    .alert--success { background:var(--success-bg); color:var(--success); border:1px solid var(--success); }
    .alert--error { background:var(--danger-bg); color:var(--danger); border:1px solid var(--danger); }
    .page-header { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .back-btn, .btn-ghost { display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); background:transparent; color:var(--text-2); border-radius:var(--r-md); padding:0.65rem 1rem; text-decoration:none; }
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; }
    .page-icon svg { width:22px; height:22px; }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); }
    .card__title { font-size:0.95rem; font-weight:700; }
    .summary-grid { padding:1.25rem; display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:0.875rem; }
    .summary-grid div { background:var(--surface-2); border:1px solid var(--border); border-radius:var(--r-md); padding:0.75rem; display:flex; flex-direction:column; gap:0.2rem; }
    .label { font-size:0.72rem; font-weight:700; color:var(--text-3); text-transform:uppercase; }
    .form-body { padding:1.25rem; display:flex; flex-direction:column; gap:1rem; }
    .form-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.875rem; }
    .field { display:flex; flex-direction:column; gap:5px; }
    .field--wide { grid-column:span 2; }
    .field label { font-size:0.78rem; font-weight:600; color:var(--text-2); }
    input, select { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:0.65rem 0.8rem; color:var(--text-1); font:inherit; }
    .form-footer { display:flex; justify-content:flex-end; gap:0.75rem; }
    .btn-primary { display:inline-flex; align-items:center; justify-content:center; background:var(--primary); color:#fff; border:none; border-radius:var(--r-md); padding:0.65rem 1rem; font-weight:600; cursor:pointer; }
    @media (max-width: 900px) { .form-grid { grid-template-columns:1fr 1fr; } .field--wide { grid-column:span 1; } }
    @media (max-width: 640px) { .form-grid { grid-template-columns:1fr; } }
  `]
})
export class MutuelleDossierFormPageComponent implements OnInit {
  adherent: AdherentResponse | null = null;
  mode: 'create' | 'view' | 'edit' = 'create';
  dossierId: number | null = null;
  successMsg = '';
  errorMsg = '';

  readonly form = this.fb.nonNullable.group({
    typeCourrier: ['INTERNE', Validators.required],
    numeroOrdre: ['', Validators.required],
    numeroEnvoi: [''],
    dateEnvoi: [''],
    dateReception: [''],
    designation: ['', Validators.required],
    typeDossier: ['NORMAL' as MutuelleDossierType, Validators.required],
    centreSoin: [''],
    observation: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: MutuelleService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(([params, query]) => {
      const mode = query.get('mode');
      this.mode = mode === 'view' || mode === 'edit' ? mode : 'create';
      this.dossierId = Number(query.get('dossierId')) || null;

      const adherentId = Number(params.get('adherentId'));
      if (!adherentId) {
        this.router.navigate(['/module/mutuelle/adherents']);
        return;
      }

      this.service.getAdherent(adherentId).subscribe({
        next: (adherent) => this.adherent = adherent,
        error: () => {
          this.errorMsg = 'Adhérent introuvable.';
          this.router.navigate(['/module/mutuelle/adherents']);
        }
      });

      if (this.dossierId) {
        this.loadDossier(this.dossierId);
      } else {
        this.form.reset({
          typeCourrier: 'INTERNE',
          numeroOrdre: '',
          numeroEnvoi: '',
          dateEnvoi: '',
          dateReception: '',
          designation: '',
          typeDossier: 'NORMAL',
          centreSoin: '',
          observation: '',
        });
      }
      this.updateInteractivity();
    });
  }

  save(): void {
    if (this.mode === 'view' || !this.adherent) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('Complétez les champs obligatoires.');
      return;
    }

    const raw = this.form.getRawValue();
    const payload: MutuelleDossierRequest = {
      adherentId: this.adherent.id,
      typeCourrier: raw.typeCourrier as 'INTERNE' | 'EXTERNE',
      numeroOrdre: raw.numeroOrdre,
      numeroEnvoi: raw.numeroEnvoi || null,
      dateEnvoi: raw.dateEnvoi || null,
      dateReception: raw.dateReception || null,
      designation: raw.designation,
      typeDossier: raw.typeDossier,
      centreSoin: raw.centreSoin || null,
      observation: raw.observation || null,
    };

    const req$ = this.dossierId
      ? this.service.updateDossier(this.dossierId, payload)
      : this.service.createDossier(payload);

    req$.subscribe({
      next: () => {
        this.showSuccess(this.dossierId ? 'Dossier mutuelle mis à jour.' : 'Dossier mutuelle enregistré.');
        setTimeout(() => this.goHistory(), 700);
      },
      error: (e: any) => this.showError(e?.error?.message || 'Enregistrement impossible.')
    });
  }

  switchToEdit(): void {
    if (!this.adherent || !this.dossierId) return;
    this.router.navigate(['/module/mutuelle/dossier', this.adherent.id], {
      queryParams: { dossierId: this.dossierId, mode: 'edit' }
    });
  }

  goHistory(): void {
    this.router.navigate(['/module/mutuelle/historique']);
  }

  private loadDossier(id: number): void {
    this.service.getDossier(id).subscribe({
      next: (dossier) => {
        this.form.patchValue({
          typeCourrier: dossier.typeCourrier,
          numeroOrdre: dossier.numeroOrdre,
          numeroEnvoi: dossier.numeroEnvoi || '',
          dateEnvoi: dossier.dateEnvoi || '',
          dateReception: dossier.dateReception || '',
          designation: dossier.designation,
          typeDossier: dossier.typeDossier,
          centreSoin: dossier.centreSoin || '',
          observation: dossier.observation || '',
        });
      },
      error: () => this.showError('Chargement du dossier impossible.')
    });
  }

  private updateInteractivity(): void {
    if (this.mode === 'view') this.form.disable({ emitEvent: false });
    else this.form.enable({ emitEvent: false });
  }

  private showSuccess(message: string): void {
    this.successMsg = message;
    this.errorMsg = '';
  }

  private showError(message: string): void {
    this.errorMsg = message;
    this.successMsg = '';
  }
}
