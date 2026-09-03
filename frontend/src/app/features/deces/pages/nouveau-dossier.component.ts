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
  templateUrl: './nouveau-dossier.component.html',
  styleUrl: './nouveau-dossier.component.scss'
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

    private readonly decesSvc: DecesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {}

  onSearchAdherent(): void {
    clearTimeout(this.searchTimer);
    if (!this.rechercheAdherent.trim()) { this.resultats = []; return; }
    this.searchTimer = setTimeout(() => {
      this.decesSvc.searchAdherents(this.rechercheAdherent).subscribe({
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
