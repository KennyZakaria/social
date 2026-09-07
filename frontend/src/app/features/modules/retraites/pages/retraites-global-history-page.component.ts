import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetraitesStoreService } from '../services/retraites-store.service';

@Component({
  selector: 'app-retraites-global-history-page', imports: [CommonModule],
  templateUrl: './retraites-global-history-page.component.html',
  styleUrl: './retraites-global-history-page.component.css'
})
export class RetraitesGlobalHistoryPageComponent {
  activities: { reference: string; nom: string; action: string; date: string; }[] = [];
  constructor(private readonly store: RetraitesStoreService) { this.store.list().subscribe(rows => this.activities = rows.map(dossier => ({ reference: dossier.reference, nom: dossier.nom, action: dossier.traite ? 'Dossier clôturé' : 'Dossier en cours', date: dossier.miseAJour }))); }
}
