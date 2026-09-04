import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { DecesService } from '../services/deces.service';
import { PiecesJustificativesService } from '../services/pieces-justificatives.service';
import { DossierDecesResponse, PieceJustificativeResponse } from '../../../models';

type PieceType = 'ACTE_DECES' | 'CIN_ADHERENT' | 'LIVRET_FAMILLE' | 'RIB_BENEFICIAIRE';

interface ChecklistPiece {
  typePiece: PieceType;
  libelle: string;
  present: boolean;
  saving: boolean;
  id?: number;
}

const DEFAULT_PIECES: ChecklistPiece[] = [
  { typePiece: 'ACTE_DECES', libelle: 'Acte de d\u00e9c\u00e8s', present: false, saving: false },
  { typePiece: 'CIN_ADHERENT', libelle: 'Copie CIN de l\u2019adh\u00e9rent', present: false, saving: false },
  { typePiece: 'LIVRET_FAMILLE', libelle: 'Livret de famille', present: false, saving: false },
  { typePiece: 'RIB_BENEFICIAIRE', libelle: 'RIB du b\u00e9n\u00e9ficiaire', present: false, saving: false }
];

@Component({
  selector: 'app-pieces-justificatives',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pieces-justificatives.component.html',
  styleUrl: './pieces-justificatives.component.scss'
})
export class PiecesJustificativesComponent implements OnInit {
  dossiers: DossierDecesResponse[] = [];
  filteredDossiers: DossierDecesResponse[] = [];
  selectedDossier: DossierDecesResponse | null = null;
  dossierSearch = '';

  loading = false;
  piecesLoading = false;
  error = '';
  successMessage = '';

  pieces: ChecklistPiece[] = this.cloneDefaultPieces();

  constructor(
    private readonly deces: DecesService,
    private readonly piecesService: PiecesJustificativesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chargerDossiers();
  }

  chargerDossiers(): void {
    this.loading = true;
    this.error = '';

    this.deces.findAll()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (data: DossierDecesResponse[]) => {
          this.dossiers = data ?? [];
          // On ne remplit plus filteredDossiers ici : la liste
          // ne doit apparaitre que lorsque l'utilisateur tape une recherche.
          this.filteredDossiers = [];
          this.selectDossierFromQueryParam();
        },
        error: (err) => {
          console.error('Erreur chargement dossiers :', err);
          this.dossiers = [];
          this.filteredDossiers = [];
          this.error = 'Impossible de charger les dossiers.';
        }
      });
  }

  onSearchDossier(): void {
    const search = this.dossierSearch.toLowerCase().trim();

    if (!search) {
      // Champ vide -> aucune liste affichee.
      this.filteredDossiers = [];
      return;
    }

    this.filteredDossiers = this.dossiers.filter((dossier) => {
      const numero = dossier.numero?.toLowerCase() ?? '';
      const nom = dossier.nomComplet?.toLowerCase() ?? '';
      const matricule = dossier.matricule?.toLowerCase() ?? '';

      return numero.includes(search) || nom.includes(search) || matricule.includes(search);
    });
  }

  selectDossier(dossier: DossierDecesResponse): void {
    this.selectedDossier = dossier;
    this.dossierSearch = '';
    this.filteredDossiers = [];
    this.successMessage = '';
    this.loadPieces(dossier.id);
  }

  clearDossier(): void {
    this.selectedDossier = null;
    this.dossierSearch = '';
    this.filteredDossiers = [];
    this.pieces = this.cloneDefaultPieces();
    this.successMessage = '';
  }

  togglePiece(piece: ChecklistPiece): void {
    if (!this.selectedDossier || piece.saving) {
      return;
    }

    const previousValue = piece.present;
    piece.present = !piece.present;
    piece.saving = true;
    this.error = '';
    this.successMessage = '';

    this.piecesService.save(this.selectedDossier.id, piece.typePiece, {
      libelle: piece.libelle,
      present: piece.present
    }).pipe(finalize(() => piece.saving = false))
      .subscribe({
        next: (saved) => {
          this.mergePiece(saved);
          this.successMessage = 'Pi\u00e8ce justificative enregistr\u00e9e.';
        },
        error: (err) => {
          console.error('Erreur sauvegarde piece justificative :', err);
          piece.present = previousValue;
          this.error = 'Impossible d\u2019enregistrer cette pi\u00e8ce.';
        }
      });
  }

  get checkedCount(): number {
    return this.pieces.filter(piece => piece.present).length;
  }

  pieceState(piece: ChecklistPiece): string {
    if (piece.saving) {
      return 'Sauvegarde...';
    }

    return piece.present ? 'Re\u00e7ue' : 'Manquante';
  }

  private loadPieces(dossierId: number): void {
    this.piecesLoading = true;
    this.error = '';
    this.pieces = this.cloneDefaultPieces();

    this.piecesService.list(dossierId)
      .pipe(finalize(() => this.piecesLoading = false))
      .subscribe({
        next: (data) => data.forEach(piece => this.mergePiece(piece)),
        error: (err) => {
          console.error('Erreur chargement pieces justificatives :', err);
          this.error = 'Impossible de charger les pi\u00e8ces justificatives.';
        }
      });
  }

  private mergePiece(saved: PieceJustificativeResponse): void {
    const piece = this.pieces.find(item => item.typePiece === saved.typePiece);

    if (!piece) {
      return;
    }

    piece.id = saved.id;
    piece.libelle = saved.libelle;
    piece.present = saved.present;
  }

  private cloneDefaultPieces(): ChecklistPiece[] {
    return DEFAULT_PIECES.map(piece => ({ ...piece }));
  }

  private selectDossierFromQueryParam(): void {
    const dossierId = Number(this.route.snapshot.queryParamMap.get('dossierId'));
    if (!dossierId || this.selectedDossier?.id === dossierId) return;
    const dossier = this.dossiers.find(item => item.id === dossierId);
    if (dossier) this.selectDossier(dossier);
  }}