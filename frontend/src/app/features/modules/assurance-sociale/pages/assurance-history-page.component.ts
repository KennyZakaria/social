import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssuranceRecordResponse, AssuranceRecordType } from '../../../../models';
import { AssuranceSocialeService } from '../assurance-sociale.service';

@Component({
  selector: 'app-assurance-history-page',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page assurance-print-area">
      <div class="alert alert--error no-print" *ngIf="errorMsg" (click)="errorMsg=''">{{ errorMsg }}</div>

      <div class="page-header no-print">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/><rect x="7" y="13" width="10" height="8" rx="2"/><path d="M9 7h6"/></svg>
        </div>
        <div>
          <p class="page-kicker">Assurance Sociale</p>
          <h2 class="page-title">Historique assurance</h2>
        </div>
      </div>

      <div class="card no-print">
        <div class="filters-panel">
          <div class="filters-main">
            <label class="search-box">
              <span>Recherche</span>
              <input [(ngModel)]="searchTerm" (keyup.enter)="loadRecords()" class="filter-input" placeholder="N°, nom, matricule, CIN, grade..." />
            </label>

            <div class="type-pills">
              <button type="button" class="pill" [class.pill--active]="typeFilter === ''" (click)="setTypeFilter('')">Tous</button>
              <button type="button" class="pill" [class.pill--active]="typeFilter === 'INVALIDITE'" (click)="setTypeFilter('INVALIDITE')">Invalidité</button>
              <button type="button" class="pill" [class.pill--active]="typeFilter === 'DECES'" (click)="setTypeFilter('DECES')">Décès</button>
            </div>
          </div>

          <div class="filters-secondary">
            <label class="filter-card" *ngIf="typeFilter === 'INVALIDITE'">
              <span>Imputabilité</span>
              <select [(ngModel)]="imputableFilter" (ngModelChange)="loadRecords()">
                <option value="">Toutes imputabilités</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </label>

            <label class="filter-card" *ngIf="typeFilter === 'DECES'">
              <span>Référence d'envoi</span>
              <select [(ngModel)]="referenceFilter" (ngModelChange)="loadRecords()">
                <option value="">Toutes références</option>
                <option *ngFor="let option of referenceOptions" [value]="option">{{ option }}</option>
              </select>
            </label>

            <div class="toolbar-actions">
              <button class="btn-ghost" type="button" (click)="clearFilters()">Réinitialiser</button>
              <button class="btn-ghost" type="button" (click)="loadRecords()">Filtrer</button>
              <button class="btn-primary" type="button" (click)="exportRecords()">Exporter Excel</button>
              <button class="btn-primary" type="button" (click)="printPage()">Imprimer</button>
            </div>
          </div>

          <div class="filter-state" *ngIf="hasActiveFilters()">
            <span class="state-chip">{{ typeFilter ? (typeFilter === 'INVALIDITE' ? 'Type: Invalidité' : 'Type: Décès') : 'Type: Tous' }}</span>
            <span class="state-chip" *ngIf="searchTerm.trim()">Recherche: {{ searchTerm.trim() }}</span>
            <span class="state-chip" *ngIf="typeFilter === 'INVALIDITE' && imputableFilter">{{ imputableFilter === 'true' ? 'Imputable' : 'Non imputable' }}</span>
            <span class="state-chip" *ngIf="typeFilter === 'DECES' && referenceFilter">Réf: {{ referenceFilter }}</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <p class="card__title">Historique filtré ({{ records.length }})</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th><th>N°</th><th>Nom</th><th>Grade</th><th>Matricule</th><th>CIN</th><th>Détail</th><th>Référence / Statut</th><th>Montants</th><th>Date création</th><th class="no-print">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let record of records">
                <td><span class="type-badge" [class.type-badge--deces]="record.type === 'DECES'">{{ record.type === 'INVALIDITE' ? 'Invalidité' : 'Décès' }}</span></td>
                <td>{{ record.numero }}</td>
                <td>{{ record.nomComplet }}</td>
                <td>{{ record.grade || '—' }}</td>
                <td class="mono">{{ record.matricule || '—' }}</td>
                <td class="mono">{{ record.cin || '—' }}</td>
                <td>{{ detailText(record) }}</td>
                <td>{{ refText(record) }}</td>
                <td>{{ montantText(record) }}</td>
                <td>{{ record.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                <td class="no-print">
                  <div class="row-actions">
                    <button class="btn-row btn-row--primary" type="button" (click)="openRecord(record, 'view')">Voir dossier</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="records.length === 0"><td colspan="11" class="empty-row">Aucun historique à afficher.</td></tr>
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
    .filters-panel { padding:1rem 1.25rem; display:flex; flex-direction:column; gap:1rem; background:linear-gradient(180deg, #f8fafc 0%, #ffffff 100%); }
    .filters-main { display:flex; gap:1rem; align-items:end; flex-wrap:wrap; }
    .filters-secondary { display:flex; gap:1rem; align-items:end; flex-wrap:wrap; }
    .search-box, .filter-card { display:flex; flex-direction:column; gap:0.45rem; }
    .search-box { min-width:280px; flex:1; }
    .search-box span, .filter-card span { font-size:0.76rem; font-weight:700; color:var(--text-3); text-transform:uppercase; letter-spacing:0.06em; }
    .filter-input, select { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:0.65rem 0.8rem; color:var(--text-1); font:inherit; }
    .filter-input { min-width:260px; }
    .type-pills { display:flex; gap:0.5rem; flex-wrap:wrap; }
    .pill { border:1px solid #cbd5e1; background:#fff; color:#475569; border-radius:999px; padding:0.65rem 0.95rem; font-weight:700; cursor:pointer; }
    .pill--active { background:#0f172a; color:#fff; border-color:#0f172a; }
    .toolbar-actions { display:flex; gap:0.65rem; align-items:center; flex-wrap:wrap; margin-left:auto; }
    .filter-state { display:flex; gap:0.55rem; flex-wrap:wrap; }
    .state-chip { display:inline-flex; align-items:center; border-radius:999px; background:#e2e8f0; color:#334155; padding:0.35rem 0.7rem; font-size:0.76rem; font-weight:700; }
    .btn-primary, .btn-ghost { display:inline-flex; align-items:center; justify-content:center; gap:6px; border-radius:var(--r-md); padding:0.65rem 1rem; font-weight:600; cursor:pointer; }
    .btn-primary { background:var(--primary); color:#fff; border:none; }
    .btn-ghost { background:transparent; color:var(--text-2); border:1px solid var(--border); }
    .table-wrap { overflow:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead { background:var(--surface-2); }
    th { text-align:left; padding:0.7rem 1rem; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-3); border-bottom:1px solid var(--border); }
    td { padding:0.8rem 1rem; border-bottom:1px solid var(--border); vertical-align:middle; }
    tbody tr:hover { background:var(--surface-2); }
    .mono { font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace; }
    .type-badge { display:inline-block; padding:0.2rem 0.6rem; border-radius:999px; background:#e0f2fe; color:#0369a1; font-size:0.72rem; font-weight:700; }
    .type-badge--deces { background:#fee2e2; color:#b91c1c; }
    .row-actions { display:flex; gap:0.45rem; flex-wrap:wrap; }
    .btn-row { border:1px solid var(--border); background:#fff; color:var(--text-2); border-radius:999px; padding:0.45rem 0.75rem; font-size:0.75rem; font-weight:700; cursor:pointer; }
    .btn-row--primary { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
    .empty-row { text-align:center; color:var(--text-3); padding:2rem; }
    @media (max-width: 860px) {
      .toolbar-actions { margin-left:0; }
    }
    @media print {
      .no-print { display:none !important; }
      .page { gap:0.5rem; }
      .card { box-shadow:none; border-color:#d1d5db; }
      body { background:#fff; }
    }
  `]
})
export class AssuranceHistoryPageComponent implements OnInit {
  records: AssuranceRecordResponse[] = [];
  searchTerm = '';
  typeFilter = '';
  imputableFilter = '';
  referenceFilter = '';
  errorMsg = '';

  readonly referenceOptions = ['Courrier interne', 'Décision commission', 'CNAS', 'Mutuelle', 'Autre'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly service: AssuranceSocialeService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const type = params.get('type');
      this.typeFilter = type === 'INVALIDITE' || type === 'DECES' ? type : '';
      this.loadRecords();
    });
  }

  setTypeFilter(type: '' | AssuranceRecordType): void {
    this.typeFilter = type;
    this.onTypeChange();
    this.loadRecords();
  }

  onTypeChange(): void {
    this.imputableFilter = '';
    this.referenceFilter = '';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.typeFilter = '';
    this.imputableFilter = '';
    this.referenceFilter = '';
    this.loadRecords();
  }

  loadRecords(): void {
    this.service.listRecords(this.typeValue(), this.searchTerm, this.imputableValue(), this.referenceValue()).subscribe({
      next: (rows) => this.records = rows,
      error: () => this.errorMsg = 'Chargement de l’historique impossible.'
    });
  }

  exportRecords(): void {
    this.service.exportRecords(this.typeValue(), this.searchTerm, this.imputableValue(), this.referenceValue()).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = this.typeFilter ? `${this.typeFilter.toLowerCase()}-assurance.xlsx` : 'historique-assurance.xlsx';
        anchor.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.errorMsg = 'Export impossible.'
    });
  }

  printPage(): void {
    window.print();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm.trim() || this.typeFilter || this.imputableFilter || this.referenceFilter);
  }

  openRecord(record: AssuranceRecordResponse, mode: 'view' | 'edit' = 'view'): void {
    const segment = record.type === 'INVALIDITE' ? 'invalidite' : 'deces';
    this.router.navigate([`/module/assurance-sociale/${segment}/${record.adherentId}`], {
      queryParams: { recordId: record.id, mode }
    });
  }

  detailText(record: AssuranceRecordResponse): string {
    return record.type === 'INVALIDITE'
      ? `${record.maladie || '—'}${record.codeMaladie ? ' · ' + record.codeMaladie : ''}`
      : (record.causeDeces || '—');
  }

  refText(record: AssuranceRecordResponse): string {
    return record.type === 'INVALIDITE'
      ? (record.imputable === null || record.imputable === undefined ? '—' : (record.imputable ? 'Imputable' : 'Non imputable'))
      : (record.referenceEnvoi || '—');
  }

  montantText(record: AssuranceRecordResponse): string {
    return record.type === 'INVALIDITE'
      ? (record.tauxInvalidite === null || record.tauxInvalidite === undefined ? '—' : `${record.tauxInvalidite}%`)
      : `P:${record.peculeMontant ?? 0} / D:${record.decesMontant ?? 0}`;
  }

  private typeValue(): AssuranceRecordType | null {
    return this.typeFilter === 'INVALIDITE' || this.typeFilter === 'DECES' ? this.typeFilter : null;
  }

  private imputableValue(): boolean | null {
    if (this.typeFilter !== 'INVALIDITE') return null;
    if (this.imputableFilter === 'true') return true;
    if (this.imputableFilter === 'false') return false;
    return null;
  }

  private referenceValue(): string | undefined {
    return this.typeFilter === 'DECES' ? this.referenceFilter || undefined : undefined;
  }
}