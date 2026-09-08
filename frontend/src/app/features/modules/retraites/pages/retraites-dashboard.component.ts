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
      .sort((a, b) => this.parseDate(b.miseAJour) - this.parseDate(a.miseAJour))
      .slice(0, 5);
  }

  private parseDate(value: string): number {
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) return Date.parse(value) || 0;
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, (month || 1) - 1, day || 1).getTime();
  }
}
  
