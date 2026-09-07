import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MutuelleDossierResponse } from '../../../../models';
import { MutuelleService } from '../mutuelle.service';

@Component({
  selector: 'app-mutuelle-history-page',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="alert alert--error" *ngIf="errorMsg" (click)="errorMsg=''">{{ errorMsg }}</div>

      <div class="page-header">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/><rect x="7" y="13" width="10" height="8" rx="2"/><path d="M9 7h6"/></svg>
        </div>
        <div>
          <p class="page-kicker">Section Mutuelle</p>
          <h2 class="page-title">Historique courrier</h2>
        </div>
      </div>

      <div class="card">
        <div class="filters-row">
          <input [(ngModel)]="searchTerm" class="filter-input" placeholder="N°, ordre, envoi, nom, matricule, CIN..." />
          <select [(ngModel)]="typeCourrierFilter">
            <option value="">Type courrier</option>
            <option value="INTERNE">Interne</option>
            <option value="EXTERNE">Externe</option>
          </select>
          <select [(ngModel)]="typeDossierFilter">
            <option value="">Type dossier</option>
            <option value="ALD">ALD</option>
            <option value="NORMAL">Normal</option>
            <option value="DENTAIRE">Dentaire</option>
          </select>
          <input type="date" [(ngModel)]="dateFrom" />
          <input type="date" [(ngModel)]="dateTo" />
          <button class="btn-ghost" type="button" (click)="clearFilters()">Réinitialiser</button>
          <button class="btn-primary" type="button" (click)="loadRecords()">Filtrer</button>
        </div>
      </div>

      <div class="card">
        <div class="card__head"><p class="card__title">Historique ({{ records.length }})</p></div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N° Dossier</th><th>Adhérent</th><th>Type courrier</th><th>N° ordre</th><th>N° envoi</th><th>Date envoi</th><th>Date réception</th><th>Type dossier</th><th>Désignation</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let record of records">
                <td>{{ record.numeroDossier }}</td>
                <td>{{ record.nomComplet }}<div class="sub mono">{{ record.matricule || '—' }} · {{ record.cin || '—' }}</div></td>
                <td>{{ record.typeCourrier === 'INTERNE' ? 'Interne' : 'Externe' }}</td>
                <td>{{ record.numeroOrdre }}</td>
                <td>{{ record.numeroEnvoi || '—' }}</td>
                <td>{{ record.dateEnvoi ? (record.dateEnvoi | date:'dd/MM/yyyy') : '—' }}</td>
                <td>{{ record.dateReception ? (record.dateReception | date:'dd/MM/yyyy') : '—' }}</td>
                <td>{{ typeDossierLabel(record.typeDossier) }}</td>
                <td>{{ record.designation }}</td>
                <td><button class="btn-row" type="button" (click)="openRecord(record)">Voir dossier</button></td>
              </tr>
              <tr *ngIf="records.length === 0"><td colspan="10" class="empty-row">Aucun dossier mutuelle.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:1.25rem; }
    .alert { padding:0.75rem 1rem; border-radius:var(--r-md); font-size:0.875rem; font-weight:500; cursor:pointer; }
    .alert--error { background:var(--danger-bg); color:var(--danger); border:1px solid var(--danger); }
    .page-header { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; }
    .page-icon { width:48px; height:48px; border-radius:var(--r-lg); background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; }
    .page-icon svg { width:22px; height:22px; }
    .page-kicker { font-size:0.7rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-3); }
    .page-title { font-size:1.35rem; font-weight:700; }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); }
    .card__title { font-size:0.95rem; font-weight:700; }
    .filters-row { display:flex; gap:0.75rem; align-items:center; padding:1rem 1.25rem; flex-wrap:wrap; }
    .filter-input, select, input[type='date'] { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:0.65rem 0.8rem; color:var(--text-1); font:inherit; }
    .filter-input { min-width:260px; flex:1; }
    .btn-primary, .btn-ghost { display:inline-flex; align-items:center; justify-content:center; gap:6px; border-radius:var(--r-md); padding:0.65rem 1rem; font-weight:600; cursor:pointer; }
    .btn-primary { background:var(--primary); color:#fff; border:none; }
    .btn-ghost { background:transparent; color:var(--text-2); border:1px solid var(--border); }
    .btn-row { border:1px solid var(--border); background:#fff; color:var(--text-2); border-radius:999px; padding:0.45rem 0.75rem; font-size:0.75rem; font-weight:700; cursor:pointer; }
    .table-wrap { overflow:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead { background:var(--surface-2); }
    th { text-align:left; padding:0.7rem 1rem; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-3); border-bottom:1px solid var(--border); }
    td { padding:0.8rem 1rem; border-bottom:1px solid var(--border); vertical-align:middle; }
    tbody tr:hover { background:var(--surface-2); }
    .mono { font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace; }
    .sub { font-size:0.74rem; color:var(--text-3); }
    .empty-row { text-align:center; color:var(--text-3); padding:2rem; }
  `]
})
export class MutuelleHistoryPageComponent implements OnInit {
  records: MutuelleDossierResponse[] = [];
  searchTerm = '';
  typeCourrierFilter = '';
  typeDossierFilter = '';
  dateFrom = '';
  dateTo = '';
  errorMsg = '';

  constructor(private readonly service: MutuelleService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.service.listDossiers(
      this.searchTerm,
      this.typeCourrierFilter ? this.typeCourrierFilter as 'INTERNE' | 'EXTERNE' : null,
      this.typeDossierFilter ? this.typeDossierFilter as 'ALD' | 'NORMAL' | 'DENTAIRE' : null,
      this.dateFrom || undefined,
      this.dateTo || undefined,
    ).subscribe({
      next: (rows) => this.records = rows,
      error: () => this.errorMsg = 'Chargement de l’historique impossible.'
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.typeCourrierFilter = '';
    this.typeDossierFilter = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.loadRecords();
  }

  openRecord(record: MutuelleDossierResponse): void {
    this.router.navigate(['/module/mutuelle/dossier', record.adherentId], {
      queryParams: { dossierId: record.id, mode: 'view' }
    });
  }

  typeDossierLabel(value: string): string {
    if (value === 'ALD') return 'ALD';
    if (value === 'DENTAIRE') return 'Dentaire';
    return 'Normal';
  }
}
