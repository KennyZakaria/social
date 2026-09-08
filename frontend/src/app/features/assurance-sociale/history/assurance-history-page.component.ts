import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssuranceRecordResponse, AssuranceRecordType } from '../../../core/models/models';
import { AssuranceSocialeService } from '../services/assurance-sociale.service';

@Component({
  selector: 'app-assurance-history-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './assurance-history-page.component.html',
  styleUrl: './assurance-history-page.component.scss'
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