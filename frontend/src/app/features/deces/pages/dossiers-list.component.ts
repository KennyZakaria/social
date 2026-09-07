import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DecesService } from '../services/deces.service';
import { DossierDecesResponse } from '../../../models';

@Component({
  selector: 'app-dossiers-deces-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './dossiers-list.component.html',
  styleUrl: './dossiers-list.component.scss'
})
export class DossiersListComponent implements OnInit {
  dossiers: DossierDecesResponse[] = [];
  loading = false;
  searchTerm = '';
  successMsg = '';
  errorMsg = '';
  readonly pageSize = 10;
  currentPage = 1;

  constructor(private readonly svc: DecesService, private readonly router: Router, private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.searchTerm = this.route.snapshot.queryParamMap.get('search') || '';
    this.load();
  }

  get filtered(): DossierDecesResponse[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.dossiers;
    return this.dossiers.filter(d =>
      d.numero.toLowerCase().includes(q) ||
      d.nomComplet.toLowerCase().includes(q) ||
      (d.matricule || '').toLowerCase().includes(q));
  }

  get pagedDossiers(): DossierDecesResponse[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages(): number { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }
  get pageNumbers(): number[] { return Array.from({ length: this.totalPages }, (_, index) => index + 1); }
  get firstDisplayedItem(): number { return this.filtered.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1; }
  get lastDisplayedItem(): number { return Math.min(this.currentPage * this.pageSize, this.filtered.length); }

  onSearchChange(): void { this.currentPage = 1; }
  goToPage(page: number): void { if (page >= 1 && page <= this.totalPages) this.currentPage = page; }

  openDetail(dossier: DossierDecesResponse): void { this.router.navigate(['/deces/dossiers', dossier.id]); }
  openAyants(dossier: DossierDecesResponse): void { this.router.navigate(['/deces/ayants-droit'], { queryParams: { adherentId: dossier.adherentId } }); }

  archiver(dossier: DossierDecesResponse): void {
    if (!confirm('Archiver definitivement le dossier ' + dossier.numero + ' ?')) return;
    this.svc.archiverDossier(dossier.id).subscribe({
      next: updated => { dossier.statut = updated.statut; this.show('Dossier archive.'); },
      error: error => this.showErr(error?.error?.message || 'Archivage impossible.')
    });
  }

  private load(): void {
    this.loading = true;
    this.svc.findAll().subscribe({
      next: dossiers => { this.dossiers = dossiers; this.currentPage = Math.min(this.currentPage, this.totalPages); this.loading = false; },
      error: () => { this.loading = false; this.showErr('Impossible de charger les dossiers.'); }
    });
  }

  private show(message: string): void { this.successMsg = message; setTimeout(() => this.successMsg = '', 4000); }
  private showErr(message: string): void { this.errorMsg = message; setTimeout(() => this.errorMsg = '', 5000); }
}