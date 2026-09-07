import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';
import { RetraitesExportService } from '../services/retraites-export.service';

@Component({
  selector: 'app-retraites-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './retraites-dashboard.component.html',
  styleUrl: './retraites-dashboard.component.css'
})
export class RetraitesDashboardComponent {
  dossiers = this.store.all();
  constructor(private readonly store: RetraitesStoreService, private readonly exporter: RetraitesExportService) {}
  count(status: RetraiteDossier['statut']) { return this.dossiers.filter(d => d.statut === status).length; }
  lastUpdate(dossier: RetraiteDossier): string { return dossier.miseAJour || new Date().toLocaleDateString('fr-FR'); }
  isClosed(dossier: RetraiteDossier): boolean { return this.store.isClosed(dossier); }
  export(dossier: RetraiteDossier): void { if (this.isClosed(dossier)) this.exporter.export(dossier); }

  get recentDossiers() {
    return [...this.dossiers]
      .sort((a, b) => this.parseDate(b.miseAJour) - this.parseDate(a.miseAJour))
      .slice(0, 5);
  }

  private parseDate(value: string): number {
    const [day, month, year] = value.split('/').map(Number);
    return new Date(year, (month || 1) - 1, day || 1).getTime();
  }
}
  
