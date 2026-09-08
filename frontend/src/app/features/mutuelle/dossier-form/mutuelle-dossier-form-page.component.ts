import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AdherentResponse, MutuelleDossierRequest, MutuelleDossierType } from '../../../core/models/models';
import { MutuelleService } from '../services/mutuelle.service';

@Component({
  selector: 'app-mutuelle-dossier-form-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './mutuelle-dossier-form-page.component.html',
  styleUrl: './mutuelle-dossier-form-page.component.scss'
})
export class MutuelleDossierFormPageComponent implements OnInit {
  adherent: AdherentResponse | null = null;
  mode: 'create' | 'view' | 'edit' = 'create';
  dossierId: number | null = null;
  successMsg = '';
  errorMsg = '';
  private readonly fb = inject(FormBuilder);

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
