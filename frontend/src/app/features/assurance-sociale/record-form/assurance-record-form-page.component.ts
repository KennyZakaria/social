import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AdherentResponse, AssuranceRecordRequest, AssuranceRecordType } from '../../../core/models/models';
import { AssuranceSocialeService } from '../services/assurance-sociale.service';

@Component({
  selector: 'app-assurance-record-form-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './assurance-record-form-page.component.html',
  styleUrl: './assurance-record-form-page.component.scss'
})
export class AssuranceRecordFormPageComponent implements OnInit {
  recordType: AssuranceRecordType = 'INVALIDITE';
  adherent: AdherentResponse | null = null;
  mode: 'create' | 'view' | 'edit' = 'create';
  recordId: number | null = null;
  successMsg = '';
  errorMsg = '';
  private readonly fb = inject(FormBuilder);

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