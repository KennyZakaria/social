import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdherentResponse } from '../../../core/models/models';
import { MutuelleService } from '../services/mutuelle.service';

@Component({
  selector: 'app-mutuelle-adherents-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mutuelle-adherents-page.component.html',
  styleUrl: './mutuelle-adherents-page.component.scss'
})
export class MutuelleAdherentsPageComponent implements OnInit {
  adherents: AdherentResponse[] = [];
  searchTerm = '';
  page = 0;
  totalPages = 0;
  totalElements = 0;
  errorMsg = '';

  constructor(private readonly service: MutuelleService) {}

  ngOnInit(): void {
    this.loadAdherents(0);
  }

  loadAdherents(page: number): void {
    const nextPage = page < 0 ? 0 : page;
    this.service.searchAdherents(this.searchTerm, nextPage).subscribe({
      next: (result) => {
        this.adherents = result.content;
        this.page = result.number;
        this.totalPages = result.totalPages;
        this.totalElements = result.totalElements;
      },
      error: () => this.errorMsg = 'Chargement des adhérents impossible.'
    });
  }
}
