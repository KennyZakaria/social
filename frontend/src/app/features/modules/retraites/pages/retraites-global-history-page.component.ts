import { SimpleDatePipe } from './simple-date.pipe';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RetraitesStoreService } from '../services/retraites-store.service';

@Component({
  selector: 'app-retraites-global-history-page', imports: [SimpleDatePipe, CommonModule],
  templateUrl: './retraites-global-history-page.component.html',
  styleUrl: './retraites-global-history-page.component.css'
})
export class RetraitesGlobalHistoryPageComponent {
  activities: { reference: string; nom: string; action: string; date: string; }[] = [];
  constructor(private readonly store: RetraitesStoreService) { this.store.list().subscribe(rows => this.activities = rows.flatMap(dossier => (dossier.details?.history ?? []).map((item: any) => ({ reference: dossier.reference, nom: dossier.nom, action: item.title, date: item.date })))); }
}
