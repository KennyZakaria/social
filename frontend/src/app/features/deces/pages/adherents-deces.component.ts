import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DecesAdherentResponse } from '../../../models';
import { DecesService } from '../services/deces.service';

type DossierFilter = 'ALL' | 'WITH' | 'WITHOUT';

@Component({
  selector: 'app-adherents-deces',
  imports: [CommonModule, FormsModule],
  templateUrl: './adherents-deces.component.html',
  styleUrl: './adherents-deces.component.scss'
})
export class AdherentsDecesComponent implements OnInit {
  adherents: DecesAdherentResponse[] = [];
  loading = false;
  errorMsg = '';
  search = '';
  dossierFilter: DossierFilter = 'ALL';
  page = 0;
  readonly pageSize = 15;
  totalElements = 0;
  totalPages = 1;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private readonly decesService: DecesService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  get pageNumbers(): number[] {
    const total = Math.max(this.totalPages, 1);
    const current = this.page + 1;
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }

  get activeBackendFilter(): boolean | null {
    if (this.dossierFilter === 'WITH') return true;
    if (this.dossierFilter === 'WITHOUT') return false;
    return null;
  }

  load(): void {
    this.loading = true;
    this.errorMsg = '';

    this.decesService.getAdherentsAvecDossier(this.search, this.page, this.pageSize, this.activeBackendFilter)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: page => {
          this.adherents = page.content ?? [];
          this.totalElements = page.totalElements ?? 0;
          this.totalPages = Math.max(page.totalPages ?? 1, 1);
          this.page = page.number ?? this.page;
        },
        error: error => {
          console.error('Erreur chargement adhérents décès :', error);
          this.adherents = [];
          this.errorMsg = 'Impossible de charger la liste des adhérents.';
        }
      });
  }

  onSearch(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.page = 0;
      this.load();
    }, 300);
  }

  onDossierFilterChange(): void {
    this.page = 0;
    this.load();
  }

  clearSearch(): void {
    this.search = '';
    this.page = 0;
    this.load();
  }

  goToPage(pageNumber: number): void {
    const nextPage = pageNumber - 1;
    if (nextPage < 0 || nextPage >= this.totalPages || nextPage === this.page) return;
    this.page = nextPage;
    this.load();
  }

  previousPage(): void {
    if (this.page === 0) return;
    this.page--;
    this.load();
  }

  nextPage(): void {
    if (this.page >= this.totalPages - 1) return;
    this.page++;
    this.load();
  }

  nouveauDossier(adherent: DecesAdherentResponse): void {
    this.router.navigate(['/deces/nouveau'], { queryParams: { adherentId: adherent.id } });
  }

  voirDossier(adherent: DecesAdherentResponse): void {
    if (!adherent.dossierDecesId) return;
    this.router.navigate(['/deces/dossiers', adherent.dossierDecesId]);
  }

  ajouterAyantDroit(adherent: DecesAdherentResponse): void {
    this.router.navigate(['/deces/ayants-droit'], { queryParams: { adherentId: adherent.id } });
  }

  piecesJustificatives(adherent: DecesAdherentResponse): void {
    if (!adherent.dossierDecesId) return;
    this.router.navigate(['/deces/pieces-justificatives'], { queryParams: { dossierId: adherent.dossierDecesId } });
  }

  initials(adherent: DecesAdherentResponse): string {
    return `${adherent.prenomAr?.charAt(0) ?? ''}${adherent.nomAr?.charAt(0) ?? ''}`.toUpperCase() || 'AD';
  }

  statutLabel(statut?: string | null): string {
    const labels: Record<string, string> = {
      EN_COURS: 'En cours',
      INCOMPLET: 'Incomplet',
      A_VALIDER: 'À valider',
      VALIDE: 'Validé',
      REJETE: 'Rejeté',
      CLOTURE: 'Clôturé',
      ARCHIVE: 'Archivé'
    };
    return statut ? labels[statut] ?? statut : 'Aucun dossier';
  }
}