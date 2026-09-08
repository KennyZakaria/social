import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdherentResponse } from '../../../core/models/models';
import { AssuranceSocialeService } from '../services/assurance-sociale.service';

@Component({
  selector: 'app-assurance-adherents-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './assurance-adherents-page.component.html',
  styleUrl: './assurance-adherents-page.component.scss'
})
export class AssuranceAdherentsPageComponent implements OnInit {
  adherents: AdherentResponse[] = [];
  searchTerm = '';
  page = 0;
  totalPages = 0;
  totalElements = 0;
  errorMsg = '';

  constructor(private readonly service: AssuranceSocialeService) {}

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