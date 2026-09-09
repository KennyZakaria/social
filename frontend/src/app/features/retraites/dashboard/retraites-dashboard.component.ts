import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';

@Component({
  selector: 'app-retraites-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './retraites-dashboard.component.html',
  styleUrl: './retraites-dashboard.component.css'
})
export class RetraitesDashboardComponent {
  readonly pageSize = 7;
  page = 1;
  dossiers: RetraiteDossier[] = [];
  constructor(private readonly store: RetraitesStoreService) { this.store.list().subscribe({ next: rows => this.dossiers = rows }); }
  count(status: RetraiteDossier['statut']) { return this.dossiers.filter(d => d.statut === status).length; }
  lastUpdate(dossier: RetraiteDossier): string {
    const value = dossier.miseAJour;
    if (!value) return new Date().toLocaleDateString('fr-FR');
    const isoDate = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return isoDate ? `${isoDate[3]}/${isoDate[2]}/${isoDate[1]}` : value;
  }

  get recentDossiers() {
    return [...this.dossiers]
      .sort((a, b) => this.parseDate(b.miseAJour) - this.parseDate(a.miseAJour));
  }
  get pageCount(): number { return Math.max(1, Math.ceil(this.recentDossiers.length / this.pageSize)); }
  get pageNumbers(): number[] { return Array.from({ length: this.pageCount }, (_, index) => index + 1); }
  get pagedDossiers(): RetraiteDossier[] { return this.recentDossiers.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }
  get firstShown(): number { return this.recentDossiers.length ? (this.page - 1) * this.pageSize + 1 : 0; }
  get lastShown(): number { return Math.min(this.page * this.pageSize, this.recentDossiers.length); }
  previousPage(): void { this.page = Math.max(1, this.page - 1); }
  nextPage(): void { this.page = Math.min(this.pageCount, this.page + 1); }
  goToPage(page: number): void { this.page = Math.min(Math.max(1, page), this.pageCount); }

  private parseDate(value: string): number {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return Date.parse(value) || 0;
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, (month || 1) - 1, day || 1).getTime();
  }
}
  
