import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AdherentResponse, AssuranceRecordRequest, AssuranceRecordType } from '../../../../models';
import { AssuranceSocialeService } from '../assurance-sociale.service';

@Component({
  selector: 'app-assurance-record-form-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">{{ successMsg }}</div>
      <div class="alert alert--error" *ngIf="errorMsg" (click)="errorMsg=''">{{ errorMsg }}</div>

      <div class="page-header">
        <a class="back-btn" routerLink="/module/assurance-sociale/adherents">Retour</a>
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M12 4h9"/><path d="M4 9h16"/><path d="M4 15h16"/></svg>
        </div>
        <div>
          <p class="page-kicker">Assurance Sociale</p>
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <span class="mode-badge" [class.mode-badge--view]="mode === 'view'">{{ modeLabel }}</span>
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
        <div class="card__head"><p class="card__title">Formulaire {{ recordType === 'INVALIDITE' ? 'invalidité' : 'décès' }}</p></div>
        <form [formGroup]="form" (ngSubmit)="saveRecord()" class="form-body">
          <div class="form-grid" *ngIf="recordType === 'INVALIDITE'; else decesFields">
            <div class="field"><label>Désignation</label><input formControlName="designation" placeholder="Désignation / texte" [readonly]="mode === 'view'" /></div>
            <div class="field field--wide"><label>Maladie</label><input formControlName="maladie" placeholder="Détails de la maladie" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Code maladie</label><input formControlName="codeMaladie" placeholder="Code maladie" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Date commission</label><input formControlName="dateCommission" type="date" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Taux d'invalidité</label><input formControlName="tauxInvalidite" type="number" min="0" max="100" step="0.01" [readonly]="mode === 'view'" /></div>
            <div class="field"><label>Imputabilité</label><select formControlName="imputable" [disabled]="mode === 'view'"><option [ngValue]="null">Choisir</option><option [ngValue]="true">Oui</option><option [ngValue]="false">Non</option></select></div>
          </div>
          <ng-template #decesFields>
            <div class="form-grid">
              <div class="field"><label>Date décès</label><input formControlName="dateDeces" type="date" [readonly]="mode === 'view'" /></div>
              <div class="field field--wide"><label>Cause</label><input formControlName="causeDeces" placeholder="Cause du décès" [readonly]="mode === 'view'" /></div>
              <div class="field"><label>Réf. d'envoi</label><select formControlName="referenceEnvoi" [disabled]="mode === 'view'"><option value="">Choisir</option><option *ngFor="let option of referenceOptions" [value]="option">{{ option }}</option></select></div>
              <div class="field"><label>Pécule (montant)</label><input formControlName="peculeMontant" type="number" min="0" step="0.01" [readonly]="mode === 'view'" /></div>
              <div class="field"><label>Décès (montant)</label><input formControlName="decesMontant" type="number" min="0" step="0.01" [readonly]="mode === 'view'" /></div>
            </div>
          </ng-template>
          <div class="form-footer">
            <button class="btn-ghost" type="button" (click)="goBack()">{{ mode === 'view' ? 'Retour historique' : 'Annuler' }}</button>
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
    .mode-badge { margin-left:auto; display:inline-flex; align-items:center; justify-content:center; padding:0.45rem 0.8rem; border-radius:999px; background:#dbeafe; color:#1d4ed8; font-size:0.78rem; font-weight:700; }
    .mode-badge--view { background:#ecfeff; color:#0f766e; }
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
export class AssuranceRecordFormPageComponent implements OnInit {
  recordType: AssuranceRecordType = 'INVALIDITE';
  adherent: AdherentResponse | null = null;
  mode: 'create' | 'view' | 'edit' = 'create';
  recordId: number | null = null;
  successMsg = '';
  errorMsg = '';

  readonly referenceOptions = ['Courrier interne', 'Décision commission', 'CNAS', 'Mutuelle', 'Autre'];

  readonly form = this.fb.nonNullable.group({
    designation: [''],
    maladie: [''],
    codeMaladie: [''],
    dateCommission: ['', Validators.required],
    tauxInvalidite: [null as number | null, Validators.required],
    imputable: [null as boolean | null, Validators.required],
    dateDeces: ['', Validators.required],
    causeDeces: ['', Validators.required],
    referenceEnvoi: ['', Validators.required],
    peculeMontant: [null as number | null],
    decesMontant: [null as number | null],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: AssuranceSocialeService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.data, this.route.paramMap, this.route.queryParamMap]).subscribe(([data, params, query]) => {
      this.recordType = data['recordType'] as AssuranceRecordType;
      const mode = query.get('mode');
      this.mode = mode === 'view' || mode === 'edit' ? mode : 'create';
      this.recordId = Number(query.get('recordId')) || null;
      this.applyTypeValidation();

      const adherentId = Number(params.get('adherentId'));
      if (!adherentId) {
        this.router.navigate(['/module/assurance-sociale/adherents']);
        return;
      }

      this.loadAdherent(adherentId);
      if (this.recordId) {
        this.loadRecord(this.recordId);
      } else {
        this.form.reset({
          designation: '',
          maladie: '',
          codeMaladie: '',
          dateCommission: '',
          tauxInvalidite: null,
          imputable: null,
          dateDeces: '',
          causeDeces: '',
          referenceEnvoi: '',
          peculeMontant: null,
          decesMontant: null,
        });
        this.updateFormInteractivity();
      }
    });
  }

  saveRecord(): void {
    if (this.mode === 'view') return;
    if (!this.adherent) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showError('Complétez les champs obligatoires.');
      return;
    }

    const raw = this.form.getRawValue();
    const payload: AssuranceRecordRequest = {
      type: this.recordType,
      adherentId: this.adherent.id,
      designation: raw.designation || null,
      maladie: raw.maladie || null,
      codeMaladie: raw.codeMaladie || null,
      dateCommission: this.recordType === 'INVALIDITE' ? raw.dateCommission || null : null,
      tauxInvalidite: this.recordType === 'INVALIDITE' ? raw.tauxInvalidite : null,
      imputable: this.recordType === 'INVALIDITE' ? raw.imputable : null,
      dateDeces: this.recordType === 'DECES' ? raw.dateDeces || null : null,
      causeDeces: this.recordType === 'DECES' ? raw.causeDeces || null : null,
      referenceEnvoi: this.recordType === 'DECES' ? raw.referenceEnvoi || null : null,
      peculeMontant: this.recordType === 'DECES' ? raw.peculeMontant : null,
      decesMontant: this.recordType === 'DECES' ? raw.decesMontant : null,
    };

    const request$ = this.recordId
      ? this.service.updateRecord(this.recordId, payload)
      : this.service.createRecord(payload);

    request$.subscribe({
      next: () => {
        this.showSuccess(this.recordId ? 'Dossier assurance mis à jour.' : 'Données assurance enregistrées.');
        setTimeout(() => this.router.navigate(['/module/assurance-sociale/historique'], { queryParams: { type: this.recordType } }), 700);
      },
      error: (e: any) => this.showError(e?.error?.message || (this.recordId ? 'Mise à jour impossible.' : 'Enregistrement impossible.'))
    });
  }

  get pageTitle(): string {
    const base = this.recordType === 'INVALIDITE' ? 'invalidité' : 'décès';
    if (this.mode === 'view') return `Voir dossier ${base}`;
    if (this.mode === 'edit') return `Mettre à jour ${base}`;
    return `Ajouter ${base}`;
  }

  get modeLabel(): string {
    if (this.mode === 'view') return 'Lecture seule';
    if (this.mode === 'edit') return 'Mise à jour';
    return 'Nouveau dossier';
  }

  goBack(): void {
    this.router.navigate(['/module/assurance-sociale/historique'], { queryParams: { type: this.recordType || null } });
  }

  switchToEdit(): void {
    if (!this.adherent || !this.recordId) return;
    const segment = this.recordType === 'INVALIDITE' ? 'invalidite' : 'deces';
    this.router.navigate([`/module/assurance-sociale/${segment}/${this.adherent.id}`], {
      queryParams: { recordId: this.recordId, mode: 'edit' }
    });
  }

  private applyTypeValidation(): void {
    const invaliditeControls = ['dateCommission', 'tauxInvalidite', 'imputable'];
    const decesControls = ['dateDeces', 'causeDeces', 'referenceEnvoi'];

    invaliditeControls.forEach((key) => {
      const control = this.form.get(key);
      if (!control) return;
      control.clearValidators();
    });
    decesControls.forEach((key) => {
      const control = this.form.get(key);
      if (!control) return;
      control.clearValidators();
    });

    if (this.recordType === 'INVALIDITE') {
      invaliditeControls.forEach((key) => this.form.get(key)?.setValidators([Validators.required]));
    } else {
      decesControls.forEach((key) => this.form.get(key)?.setValidators([Validators.required]));
    }

    [...invaliditeControls, ...decesControls].forEach((key) => this.form.get(key)?.updateValueAndValidity());
  }

  private loadAdherent(adherentId: number): void {
    this.service.getAdherent(adherentId).subscribe({
      next: (adherent) => this.adherent = adherent,
      error: () => {
        this.errorMsg = 'Adhérent introuvable.';
        this.router.navigate(['/module/assurance-sociale/adherents']);
      }
    });
  }

  private loadRecord(recordId: number): void {
    this.service.getRecord(recordId).subscribe({
      next: (record) => {
        this.form.patchValue({
          designation: record.designation || '',
          maladie: record.maladie || '',
          codeMaladie: record.codeMaladie || '',
          dateCommission: record.dateCommission || '',
          tauxInvalidite: record.tauxInvalidite ?? null,
          imputable: record.imputable ?? null,
          dateDeces: record.dateDeces || '',
          causeDeces: record.causeDeces || '',
          referenceEnvoi: record.referenceEnvoi || '',
          peculeMontant: record.peculeMontant ?? null,
          decesMontant: record.decesMontant ?? null,
        });
        this.updateFormInteractivity();
      },
      error: () => this.showError('Chargement du dossier impossible.')
    });
  }

  private updateFormInteractivity(): void {
    if (this.mode === 'view') {
      this.form.disable({ emitEvent: false });
    } else {
      this.form.enable({ emitEvent: false });
    }
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