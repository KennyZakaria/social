import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MutuelleDossierResponse } from '../../../core/models/models';
import { MutuelleService } from '../services/mutuelle.service';

@Component({
  selector: 'app-mutuelle-history-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './mutuelle-history-page.component.html',
  styleUrl: './mutuelle-history-page.component.scss'
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
