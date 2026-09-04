import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DecesService } from '../services/deces.service';
import { AyantsDroitService } from '../services/ayants-droit.service';
import { DemandeDeces, DemandesDecesService } from '../services/demandes-deces.service';
import { PiecesJustificativesService } from '../services/pieces-justificatives.service';
import {
  AdherentResponse,
  AyantDroitResponse,
  DossierDecesResponse,
  HistoriqueDossierDecesResponse,
  PieceJustificativeResponse,
  ValidationResultResponse
} from '../../../models';

type ValidationTab = 'adherent' | 'deces' | 'ayants' | 'demandes' | 'pieces' | 'controle' | 'decision';

interface ValidationDetailState {
  adherent?: AdherentResponse | null;
  ayants: AyantDroitResponse[];
  demandes: DemandeDeces[];
  pieces: PieceJustificativeResponse[];
  controle?: ValidationResultResponse | null;
  historique: HistoriqueDossierDecesResponse[];
  loading: boolean;
}

@Component({
  selector: 'app-validation',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.scss'
})
export class ValidationComponent implements OnInit {
  allDossiers: DossierDecesResponse[] = [];
  loading = false;
  expandedId: number | null = null;
  activeDetailTab: ValidationTab = 'controle';
  details: Record<number, ValidationDetailState> = {};

  search = '';
  statutFilter = '';
  dateDebut = '';
  dateFin = '';
  page = 1;
  pageSize = 6;

  commentaireValidation = '';
  motifDecision = '';
  successMsg = '';
  errorMsg = '';

  readonly detailTabs: { key: ValidationTab; label: string }[] = [
    { key: 'adherent', label: 'Adherent' },
    { key: 'deces', label: 'Deces' },
    { key: 'ayants', label: 'Ayants droit' },
    { key: 'demandes', label: 'Demandes' },
    { key: 'pieces', label: 'Pieces' },
    { key: 'controle', label: 'Controle' },
    { key: 'decision', label: 'Decision' }
  ];

  constructor(
    private readonly svc: DecesService,
    private readonly ayantsSvc: AyantsDroitService,
    private readonly demandesSvc: DemandesDecesService,
    private readonly piecesSvc: PiecesJustificativesService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get pending(): DossierDecesResponse[] {
    return this.allDossiers.filter(d => d.statut === 'A_VALIDER');
  }

  get filteredDossiers(): DossierDecesResponse[] {
    const value = this.normalize(this.search);
    const from = this.dateDebut ? new Date(this.dateDebut) : null;
    const to = this.dateFin ? new Date(this.dateFin) : null;

    return this.allDossiers.filter(d => {
      const date = d.dateDeces ? new Date(d.dateDeces) : null;
      const matchStatut = !this.statutFilter || d.statut === this.statutFilter;
      const matchFrom = !from || (date !== null && date >= from);
      const matchTo = !to || (date !== null && date <= to);
      const haystack = [d.numero, d.nomComplet, d.matricule, d.matriculeBR, d.cin].map(x => this.normalize(x)).join(' ');
      const matchSearch = !value || haystack.includes(value);
      return matchStatut && matchFrom && matchTo && matchSearch;
    });
  }

  get pagedDossiers(): DossierDecesResponse[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredDossiers.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredDossiers.length / this.pageSize));
  }

  load(): void {
    this.loading = true;
    this.svc.getDossiersAValider(this.search, this.statutFilter).subscribe({
      next: dossiers => {
        this.allDossiers = dossiers;
        this.loading = false;
        this.page = 1;
      },
      error: error => {
        this.loading = false;
        this.showErr(this.extractError(error, 'Impossible de charger les dossiers a valider.'));
      }
    });
  }

  applyFilters(): void {
    this.page = 1;
  }

  resetFilters(): void {
    this.search = '';
    this.statutFilter = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.page = 1;
  }

  countByStatut(statut: string): number {
    return this.allDossiers.filter(d => d.statut === statut).length;
  }

  openDossier(dossier: DossierDecesResponse, tab: ValidationTab = 'controle'): void {
    this.expandedId = this.expandedId === dossier.id ? null : dossier.id;
    this.activeDetailTab = tab;
    if (this.expandedId === dossier.id) {
      this.loadDetails(dossier);
    }
  }

  controleOf(id: number): ValidationResultResponse | null | undefined {
    return this.details[id]?.controle;
  }

  selectedDossier(id: number): DossierDecesResponse | undefined {
    return this.allDossiers.find(d => d.id === id);
  }

  canValidate(dossier: DossierDecesResponse): boolean {
    return dossier.statut === 'A_VALIDER' && this.controleOf(dossier.id)?.valid === true;
  }

  soumettre(dossier: DossierDecesResponse): void {
    if (!confirm(`Soumettre le dossier ${dossier.numero} a validation ?`)) return;
    this.svc.soumettreValidation(dossier.id).subscribe({
      next: response => this.afterDecision(response.dossier, `Dossier ${response.dossier.numero} soumis a validation.`),
      error: error => this.showErr(this.extractError(error, 'Soumission impossible.'))
    });
  }

  valider(dossier: DossierDecesResponse): void {
    if (!confirm(`Valider definitivement le dossier ${dossier.numero} ?`)) return;
    this.svc.validerDossier(dossier.id, { commentaire: this.commentaireValidation || 'Dossier verifie et valide' }).subscribe({
      next: response => this.afterDecision(response.dossier, `Dossier ${response.dossier.numero} valide.`),
      error: error => this.showErr(this.extractError(error, 'Validation impossible.'))
    });
  }

  retourComplement(dossier: DossierDecesResponse): void {
    const motif = this.motifDecision.trim() || prompt('Motif du retour pour complement') || '';
    if (!motif.trim()) {
      this.showErr('Le motif de retour pour complement est obligatoire.');
      return;
    }
    if (!confirm(`Retourner le dossier ${dossier.numero} pour complement ?`)) return;
    this.svc.retournerPourComplement(dossier.id, motif.trim()).subscribe({
      next: updated => this.afterDecision(updated, `Dossier ${updated.numero} retourne pour complement.`),
      error: error => this.showErr(this.extractError(error, 'Retour pour complement impossible.'))
    });
  }

  rejeter(dossier: DossierDecesResponse): void {
    const motif = this.motifDecision.trim() || prompt('Motif du rejet') || '';
    if (!motif.trim()) {
      this.showErr('Le motif de rejet est obligatoire.');
      return;
    }
    if (!confirm(`Rejeter le dossier ${dossier.numero} ?`)) return;
    this.svc.rejeterDossier(dossier.id, motif.trim()).subscribe({
      next: updated => this.afterDecision(updated, `Dossier ${updated.numero} rejete.`),
      error: error => this.showErr(this.extractError(error, 'Rejet impossible.'))
    });
  }

  cloturer(dossier: DossierDecesResponse): void {
    if (!confirm(`Cloturer le dossier ${dossier.numero} ?`)) return;
    this.svc.cloturerDossier(dossier.id).subscribe({
      next: updated => this.afterDecision(updated, `Dossier ${updated.numero} cloture.`),
      error: error => this.showErr(this.extractError(error, 'Cloture impossible.'))
    });
  }

  nextPage(): void {
    this.page = Math.min(this.totalPages, this.page + 1);
  }

  previousPage(): void {
    this.page = Math.max(1, this.page - 1);
  }

  private loadDetails(dossier: DossierDecesResponse): void {
    this.details[dossier.id] = { ayants: [], demandes: [], pieces: [], historique: [], loading: true };

    forkJoin({
      adherent: this.svc.getAdherent(dossier.adherentId).pipe(catchError(() => of(null))),
      ayants: this.ayantsSvc.list(dossier.adherentId).pipe(catchError(() => of([] as AyantDroitResponse[]))),
      demandes: this.demandesSvc.list(dossier.id).pipe(catchError(() => of([] as DemandeDeces[]))),
      pieces: this.piecesSvc.list(dossier.id).pipe(catchError(() => of([] as PieceJustificativeResponse[]))),
      controle: this.svc.getControleValidation(dossier.id).pipe(catchError(() => of(null))),
      historique: this.svc.getHistorique(dossier.id).pipe(catchError(() => of([] as HistoriqueDossierDecesResponse[])))
    }).subscribe(result => {
      this.details[dossier.id] = { ...result, loading: false };
    });
  }

  private afterDecision(updated: DossierDecesResponse, message: string): void {
    const idx = this.allDossiers.findIndex(d => d.id === updated.id);
    if (idx !== -1) {
      this.allDossiers[idx] = updated;
    }
    this.commentaireValidation = '';
    this.motifDecision = '';
    this.show(message);
    this.loadDetails(updated);
  }

  private normalize(value: string | null | undefined): string {
    return (value ?? '').trim().toLowerCase();
  }

  private extractError(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const err = (error as { error?: { message?: string } | string }).error;
      if (typeof err === 'string') return err;
      if (err?.message) return err.message;
    }
    return fallback;
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
