import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import {
  AdherentResponse,
  AyantDroitRequest,
  AyantDroitResponse,
  DossierDecesResponse,
  PieceJustificativeResponse,
  ValidationResultResponse
} from '../../../models';
import { DecesService } from '../services/deces.service';
import { AyantsDroitService } from '../services/ayants-droit.service';
import { PiecesJustificativesService } from '../services/pieces-justificatives.service';

type DetailTab = 'adherent' | 'dossier' | 'ayantsDroit' | 'pieces' | 'validation';
type PieceType = 'ACTE_DECES' | 'CIN_ADHERENT' | 'LIVRET_FAMILLE' | 'RIB_BENEFICIAIRE';

interface ChecklistPiece {
  typePiece: PieceType;
  libelle: string;
  obligatoire: boolean;
  present: boolean;
  saving: boolean;
  id?: number;
}

const DEFAULT_PIECES: ChecklistPiece[] = [
  { typePiece: 'ACTE_DECES', libelle: 'Acte de décès', obligatoire: true, present: false, saving: false },
  { typePiece: 'CIN_ADHERENT', libelle: 'Copie CIN de l’adhérent', obligatoire: true, present: false, saving: false },
  { typePiece: 'LIVRET_FAMILLE', libelle: 'Livret de famille', obligatoire: true, present: false, saving: false },
  { typePiece: 'RIB_BENEFICIAIRE', libelle: 'RIB du bénéficiaire', obligatoire: true, present: false, saving: false }
];

@Component({
  selector: 'app-dossier-detail',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dossier-detail.component.html',
  styleUrl: './dossier-detail.component.scss'
})
export class DossierDetailComponent implements OnInit {
  activeTab: DetailTab = 'adherent';
  readonly tabs: { key: DetailTab; label: string }[] = [
    { key: 'adherent', label: 'Adhérent' },
    { key: 'dossier', label: 'Dossier Décès' },
    { key: 'ayantsDroit', label: 'Ayants droit' },
    { key: 'pieces', label: 'Pièces justificatives' },
    { key: 'validation', label: 'Validation' }
  ];

  dossier: DossierDecesResponse | null = null;
  adherent: AdherentResponse | null = null;
  ayants: AyantDroitResponse[] = [];
  pieces: ChecklistPiece[] = this.clonePieces();
  controle: ValidationResultResponse | null = null;

  loading = false;
  savingDossier = false;
  savingAyant = false;
  validating = false;
  successMsg = '';
  errorMsg = '';
  formAyantOpen = false;
  editingAyantId: number | null = null;
  confirmDeleteAyantId: number | null = null;

  readonly dossierForm = this.fb.nonNullable.group({
    dateDeces: ['', Validators.required],
    lieuDeces: ['', Validators.required],
    natureDeces: [''],
    causeDeces: [''],
    dpr: [''],
    observation: ['']
  });

  readonly ayantForm = this.fb.nonNullable.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    cin: ['', Validators.required],
    lienParente: ['', Validators.required],
    dateNaissance: [''],
    telephone: [''],
    adresse: [''],
    typeRepartition: ['POURCENTAGE' as 'POURCENTAGE' | 'CHARIA', Validators.required],
    pourcentage: [null as number | null]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly decesService: DecesService,
    private readonly ayantsService: AyantsDroitService,
    private readonly piecesService: PiecesJustificativesService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get dossierId(): number {
    return Number(this.route.snapshot.paramMap.get('dossierId'));
  }

  get dossierLocked(): boolean {
    return ['VALIDE', 'CLOTURE', 'ARCHIVE'].includes(this.dossier?.statut ?? '');
  }

  get canValidate(): boolean {
    return this.dossier?.statut === 'A_VALIDER' && this.controle?.valid === true;
  }

  get canSubmit(): boolean {
    return ['EN_COURS', 'INCOMPLET'].includes(this.dossier?.statut ?? '') && this.controle?.valid === true;
  }

  selectTab(tab: DetailTab): void {
    this.activeTab = tab;
  }

  load(): void {
    if (!this.dossierId) {
      this.router.navigate(['/deces/dossiers']);
      return;
    }

    this.loading = true;
    this.errorMsg = '';
    this.decesService.findById(this.dossierId)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: dossier => {
          this.dossier = dossier;
          this.patchDossierForm(dossier);
          this.loadLinkedData(dossier);
        },
        error: error => {
          console.error('Erreur chargement détail dossier décès :', error);
          this.errorMsg = 'Impossible de charger le détail du dossier.';
        }
      });
  }

  saveDossier(): void {
    if (!this.dossier || this.dossierLocked || this.dossierForm.invalid) return;
    this.savingDossier = true;
    const raw = this.dossierForm.getRawValue();

    this.decesService.updateDossier(this.dossier.id, {
      adherentId: this.dossier.adherentId,
      dateDeces: raw.dateDeces,
      lieuDeces: raw.lieuDeces,
      natureDeces: raw.natureDeces || undefined,
      causeDeces: raw.causeDeces || undefined,
      dpr: raw.dpr || undefined,
      observation: raw.observation || undefined
    }).pipe(finalize(() => this.savingDossier = false))
      .subscribe({
        next: updated => {
          this.dossier = updated;
          this.patchDossierForm(updated);
          this.show('Dossier décès mis à jour.');
          this.refreshControle();
        },
        error: error => this.showErr(error?.error?.message || 'Enregistrement impossible.')
      });
  }

  openAyantForm(ayant?: AyantDroitResponse): void {
    if (this.dossierLocked) return;
    this.formAyantOpen = true;
    this.editingAyantId = ayant?.id ?? null;
    this.ayantForm.reset({
      nom: ayant?.nom ?? '',
      prenom: ayant?.prenom ?? '',
      cin: ayant?.cin ?? '',
      lienParente: ayant?.lienParente ?? '',
      dateNaissance: ayant?.dateNaissance ?? '',
      telephone: ayant?.telephone ?? '',
      adresse: ayant?.adresse ?? '',
      typeRepartition: (ayant?.typeRepartition as 'POURCENTAGE' | 'CHARIA') ?? 'POURCENTAGE',
      pourcentage: ayant?.pourcentage ?? null
    });
  }

  closeAyantForm(): void {
    this.formAyantOpen = false;
    this.editingAyantId = null;
    this.ayantForm.reset({ typeRepartition: 'POURCENTAGE', pourcentage: null });
  }

  saveAyant(): void {
    if (!this.dossier || this.ayantForm.invalid || this.dossierLocked) return;
    this.savingAyant = true;
    const raw = this.ayantForm.getRawValue();
    const payload: AyantDroitRequest = {
      nom: raw.nom,
      prenom: raw.prenom,
      cin: raw.cin,
      lienParente: raw.lienParente,
      dateNaissance: raw.dateNaissance || undefined,
      telephone: raw.telephone || undefined,
      adresse: raw.adresse || undefined,
      typeRepartition: raw.typeRepartition,
      pourcentage: raw.typeRepartition === 'POURCENTAGE' ? raw.pourcentage ?? undefined : undefined
    };

    const request = this.editingAyantId
      ? this.ayantsService.update(this.dossier.adherentId, this.editingAyantId, payload)
      : this.ayantsService.create(this.dossier.adherentId, payload);

    request.pipe(finalize(() => this.savingAyant = false)).subscribe({
      next: saved => {
        if (this.editingAyantId) {
          this.ayants = this.ayants.map(item => item.id === saved.id ? saved : item);
          this.show('Ayant droit modifié.');
        } else {
          this.ayants = [saved, ...this.ayants];
          this.show('Ayant droit ajouté.');
        }
        this.closeAyantForm();
        this.refreshControle();
      },
      error: error => this.showErr(error?.error?.message || 'Enregistrement de l’ayant droit impossible.')
    });
  }

  deleteAyant(id: number): void {
    if (!this.dossier || this.dossierLocked) return;
    this.ayantsService.delete(this.dossier.adherentId, id).subscribe({
      next: () => {
        this.ayants = this.ayants.filter(item => item.id !== id);
        this.confirmDeleteAyantId = null;
        this.show('Ayant droit supprimé.');
        this.refreshControle();
      },
      error: error => this.showErr(error?.error?.message || 'Suppression impossible.')
    });
  }

  togglePiece(piece: ChecklistPiece): void {
    if (!this.dossier || this.dossierLocked || piece.saving) return;
    const previous = piece.present;
    piece.present = !piece.present;
    piece.saving = true;

    this.piecesService.save(this.dossier.id, piece.typePiece, {
      libelle: piece.libelle,
      present: piece.present
    }).pipe(finalize(() => piece.saving = false))
      .subscribe({
        next: saved => {
          this.mergePiece(saved);
          this.show('Pièce justificative enregistrée.');
          this.refreshControle();
        },
        error: error => {
          console.error('Erreur sauvegarde pièce justificative :', error);
          piece.present = previous;
          this.showErr('Impossible d’enregistrer cette pièce.');
        }
      });
  }

  submitForValidation(): void {
    if (!this.dossier || !this.canSubmit) return;
    this.validating = true;
    this.decesService.soumettreValidation(this.dossier.id)
      .pipe(finalize(() => this.validating = false))
      .subscribe({
        next: response => {
          this.dossier = response.dossier;
          this.controle = response.controle;
          this.show('Dossier soumis à validation.');
        },
        error: error => this.showErr(error?.error?.message || 'Soumission impossible.')
      });
  }

  validateDossier(): void {
    if (!this.dossier || !this.canValidate) return;
    this.validating = true;
    this.decesService.validerDossier(this.dossier.id, { commentaire: 'Validation depuis la page détail' })
      .pipe(finalize(() => this.validating = false))
      .subscribe({
        next: response => {
          this.dossier = response.dossier;
          this.controle = response.controle;
          this.patchDossierForm(response.dossier);
          this.show('Dossier validé avec succès.');
        },
        error: error => this.showErr(error?.error?.message || 'Validation impossible.')
      });
  }

  pieceState(piece: ChecklistPiece): string {
    if (piece.saving) return 'Sauvegarde...';
    return piece.present ? 'Présente' : 'Manquante';
  }

  private loadLinkedData(dossier: DossierDecesResponse): void {
    forkJoin({
      adherent: this.decesService.getAdherent(dossier.adherentId).pipe(catchError(() => of(null))),
      ayants: this.ayantsService.list(dossier.adherentId).pipe(catchError(() => of([] as AyantDroitResponse[]))),
      pieces: this.piecesService.list(dossier.id).pipe(catchError(() => of([] as PieceJustificativeResponse[]))),
      controle: this.decesService.getControleValidation(dossier.id).pipe(catchError(() => of(null)))
    }).subscribe(result => {
      this.adherent = result.adherent;
      this.ayants = result.ayants;
      this.pieces = this.clonePieces();
      result.pieces.forEach(piece => this.mergePiece(piece));
      this.controle = result.controle;
    });
  }

  private refreshControle(): void {
    if (!this.dossier) return;
    this.decesService.getControleValidation(this.dossier.id).subscribe({
      next: controle => this.controle = controle,
      error: () => this.controle = null
    });
  }

  private patchDossierForm(dossier: DossierDecesResponse): void {
    this.dossierForm.patchValue({
      dateDeces: dossier.dateDeces ?? '',
      lieuDeces: dossier.lieuDeces ?? '',
      natureDeces: dossier.natureDeces ?? '',
      causeDeces: dossier.causeDeces ?? '',
      dpr: dossier.dpr ?? '',
      observation: dossier.observation ?? ''
    });
    this.dossierLocked ? this.dossierForm.disable() : this.dossierForm.enable();
  }

  private mergePiece(saved: PieceJustificativeResponse): void {
    const piece = this.pieces.find(item => item.typePiece === saved.typePiece);
    if (!piece) return;
    piece.id = saved.id;
    piece.libelle = saved.libelle;
    piece.present = saved.present;
  }

  private clonePieces(): ChecklistPiece[] {
    return DEFAULT_PIECES.map(piece => ({ ...piece }));
  }

  private show(message: string): void {
    this.successMsg = message;
    setTimeout(() => this.successMsg = '', 4000);
  }

  private showErr(message: string): void {
    this.errorMsg = message;
    setTimeout(() => this.errorMsg = '', 6000);
  }
}