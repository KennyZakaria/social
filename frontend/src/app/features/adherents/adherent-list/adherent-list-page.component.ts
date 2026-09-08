import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdherentResponse } from '../../../core/models/models';
import { AdherentsService } from '../services/adherents.service';

@Component({
  selector: 'app-adherent-list-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './adherent-list-page.component.html',
  styleUrl: './adherent-list-page.component.scss'
})
export class AdherentListPageComponent implements OnInit {
  adherents: AdherentResponse[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  loading = false;
  searchQuery = '';
  formOpen = false;
  editingId: number | null = null;
  confirmDeleteId: number | null = null;
  successMsg = '';
  errorMsg = '';
  private readonly fb = inject(FormBuilder);

  private searchTimer: any;

  readonly form = this.fb.nonNullable.group({
    prenomAr:          ['', Validators.required],
    nomAr:             ['', Validators.required],
    categorie:         ['SOUS_OFFICIERS', Validators.required],
    grade:             ['M/G', Validators.required],
    matriculeBR:       ['', Validators.required],
    matricule:         ['', Validators.required],
    dateNaissance:     ['', Validators.required],
    lieuNaissance:     ['', Validators.required],
    dateRadiation:     [null as string | null],
    motifRadiation:    [null as string | null],
    dateDeces:         [null as string | null],
    causeDeces:        [null as string | null],
    dernierUnite:      ['', Validators.required],
    formationUnite:    ['', Validators.required],
    telephone1:        ['', Validators.required],
    telephone2:        [null as string | null],
    adresse:           ['', Validators.required],
    email:             ['', [Validators.required, Validators.email]],
    situationCategorie:['EN_ACTIVITE', Validators.required],
    pension:           [false],
    cin:               ['', Validators.required],
  });

  constructor(private readonly svc: AdherentsService) {}

  ngOnInit(): void { this.load(); }

  onCategorieChange(): void {
    this.form.controls.grade.setValue('');
  }
  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage = 0; this.load(); }, 350);
  }

  goPage(p: number): void { this.currentPage = p; this.load(); }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ categorie: 'SOUS_OFFICIERS', grade: 'M/G', situationCategorie: 'EN_ACTIVITE', pension: false });
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startEdit(a: AdherentResponse): void {
    this.editingId = a.id;
    this.form.patchValue({ ...a } as any);
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm(): void { this.formOpen = false; this.editingId = null; this.form.reset({ categorie: 'SOUS_OFFICIERS', grade: 'M/G', situationCategorie: 'EN_ACTIVITE', pension: false }); }

  saveAdherent(): void {
    const payload = this.form.getRawValue() as any;
    payload.pension = payload.situationCategorie === 'RETRAITE';
    const obs = this.editingId
      ? this.svc.update(this.editingId, payload)
      : this.svc.create(payload);
    obs.subscribe({
      next: () => { this.closeForm(); this.load(); this.showSuccess(this.editingId ? 'Adhérent mis à jour.' : 'Adhérent créé.'); },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors de l\'enregistrement.')
    });
  }

  doDelete(id: number): void {
    this.svc.delete(id).subscribe({
      next: () => { this.confirmDeleteId = null; this.load(); this.showSuccess('Adhérent supprimé.'); },
      error: (e: any) => { this.confirmDeleteId = null; this.showError(e?.error?.message || 'Erreur lors de la suppression.'); }
    });
  }

  categorieLabel(categorie: string): string {
    const labels: Record<string, string> = {
      SOUS_OFFICIERS: 'Sous-officiers',
      OFFICIERS: 'Officiers',
      OFFICIERS_SUPERIEURS: 'Officiers supérieurs',
      OFFICIERS_GENERAUX: 'Officiers généraux'
    };
    return labels[categorie] ?? categorie ?? '—';
  }
  getSitClass(sit: string): string {
    const s = (sit || '').toLowerCase();
    if (s.includes('activ') || s.includes('actif')) return 'sit-badge sit--actif';
    if (s.includes('radi')) return 'sit-badge sit--radié';
    if (s.includes('déc') || s.includes('dec')) return 'sit-badge sit--décédé';
    return 'sit-badge sit--default';
  }

  private load(): void {
    this.loading = true;
    this.svc.list(this.searchQuery, this.currentPage).subscribe({
      next: (p) => {
        this.adherents     = p.content;
        this.totalElements = p.totalElements;
        this.totalPages    = p.totalPages;
        this.loading       = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private showSuccess(msg: string): void { this.successMsg = msg; this.errorMsg = ''; setTimeout(() => (this.successMsg = ''), 4000); }
  private showError(msg: string): void   { this.errorMsg = msg; this.successMsg = ''; setTimeout(() => (this.errorMsg = ''), 5000); }
}
