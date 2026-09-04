import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { AdherentResponse, DossierDecesRequest, DossierDecesResponse } from '../../../models';

type AdherentRecherche = AdherentResponse & {
  hasDossierDeces?: boolean;
  dossierNumero?: string;
  dossierStatut?: string;
};

@Component({
  selector: 'app-nouveau-dossier-deces',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './nouveau-dossier.component.html',
  styleUrl: './nouveau-dossier.component.scss'
})
export class NouveauDossierDecesComponent implements OnInit {
  adherentSelectionne: AdherentResponse | null = null;
  rechercheAdherent = '';
  resultats: AdherentRecherche[] = [];
  loading = false;
  redirecting = false;
  successMsg = '';
  errorMsg = '';
  private searchTimer: any;
  private dossiersParAdherent = new Map<number, DossierDecesResponse>();

  readonly form = this.fb.nonNullable.group({
    dateDeces: ['', Validators.required],
    lieuDeces: ['', Validators.required],
    natureDeces: [''],
    causeDeces: [''],
    dpr: [''],
    observation: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly decesSvc: DecesService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDossiersExistants();
    this.selectAdherentFromQueryParam();
  }

  onSearchAdherent(): void {
    clearTimeout(this.searchTimer);

    if (!this.rechercheAdherent.trim()) {
      this.resultats = [];
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.decesSvc.searchAdherents(this.rechercheAdherent).subscribe({
        next: p => {
          this.resultats = (p.content ?? []).map(a => this.withDossierStatus(a));
        },
        error: () => this.resultats = []
      });
    }, 300);
  }

  selectAdherent(a: AdherentRecherche): void {
    if (a.hasDossierDeces) {
      const dossier = a.dossierNumero ? ` ${a.dossierNumero}` : '';
      this.errorMsg = `Cet adherent a deja un dossier de deces${dossier}. Il ne peut pas etre selectionne.`;
      setTimeout(() => this.errorMsg = '', 5000);
      return;
    }

    this.adherentSelectionne = a;
    this.resultats = [];
    this.errorMsg = '';
  }

  changerAdherent(): void {
    this.adherentSelectionne = null;
    this.rechercheAdherent = '';
    this.resultats = [];
    this.errorMsg = '';
  }

  submitDossier(): void {
    if (!this.adherentSelectionne) return;
    this.loading = true;
    const raw = this.form.getRawValue();
    const request: DossierDecesRequest = {
      adherentId: this.adherentSelectionne.id,
      dateDeces: raw.dateDeces,
      lieuDeces: raw.lieuDeces,
      natureDeces: raw.natureDeces || undefined,
      causeDeces: raw.causeDeces || undefined,
      dpr: raw.dpr || undefined,
      observation: raw.observation || undefined,
    };

    this.decesSvc.create(request).subscribe({
      next: (d) => {
        this.loading = false;
        this.redirecting = true;
        this.dossiersParAdherent.set(d.adherentId, d);
        this.successMsg = `Dossier ${d.numero} créé avec succès. Ouverture du dossier...`;
        setTimeout(() => this.router.navigate(['/deces/dossiers', d.id]), 1600);
      },
      error: (e: any) => {
        this.loading = false;
        this.errorMsg = e?.error?.message || 'Erreur lors de la creation du dossier.';
        setTimeout(() => this.errorMsg = '', 5000);
      }
    });
  }

  private loadDossiersExistants(): void {
    this.decesSvc.findAll().subscribe({
      next: dossiers => {
        this.dossiersParAdherent.clear();

        (dossiers ?? []).forEach(dossier => {
          if (dossier.adherentId) {
            this.dossiersParAdherent.set(dossier.adherentId, dossier);
          }
        });
      },
      error: err => console.error('Erreur chargement dossiers existants :', err)
    });
  }

  private withDossierStatus(adherent: AdherentResponse): AdherentRecherche {
    const dossier = this.dossiersParAdherent.get(adherent.id);

    return {
      ...adherent,
      hasDossierDeces: !!dossier,
      dossierNumero: dossier?.numero,
      dossierStatut: dossier?.statut
    };
  }

  private selectAdherentFromQueryParam(): void {
    const adherentId = Number(this.route.snapshot.queryParamMap.get('adherentId'));
    if (!adherentId) return;

    this.decesSvc.getAdherent(adherentId).subscribe({
      next: adherent => {
        this.adherentSelectionne = adherent;
        this.rechercheAdherent = `${adherent.matricule} - ${adherent.nomAr} ${adherent.prenomAr}`;
        this.resultats = [];
      },
      error: () => this.errorMsg = 'Impossible de charger l’adhérent sélectionné.'
    });
  }}