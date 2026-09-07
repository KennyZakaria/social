import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdherentResponse } from '../../../../models';
import { AssuranceSocialeService } from '../assurance-sociale.service';

@Component({
  selector: 'app-assurance-adherents-page',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <div class="alert alert--error" *ngIf="errorMsg" (click)="errorMsg=''">{{ errorMsg }}</div>

      <div class="page-header">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div>
          <p class="page-kicker">Assurance Sociale</p>
          <h2 class="page-title">Liste des adhérents</h2>
        </div>
        <a class="btn-ghost ml-auto" routerLink="/module/assurance-sociale/historique">Historique assurance</a>
      </div>

      <div class="card">
        <div class="search-wrap">
          <input [(ngModel)]="searchTerm" placeholder="Rechercher par nom, matricule, matricule BR ou CIN..." class="search-input" />
          <button class="btn-primary" type="button" (click)="loadAdherents(0)">Rechercher</button>
        </div>
      </div>

      <div class="card">
        <div class="card__head">
          <p class="card__title">Adhérents ({{ totalElements }})</p>
          <div class="pager">
            <button class="btn-ghost" type="button" (click)="loadAdherents(page - 1)" [disabled]="page === 0">Précédent</button>
            <span>Page {{ page + 1 }} / {{ totalPages || 1 }}</span>
            <button class="btn-ghost" type="button" (click)="loadAdherents(page + 1)" [disabled]="page + 1 >= totalPages">Suivant</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Adhérent</th><th>Grade</th><th>Matricule</th><th>CIN</th><th>Mle BR</th><th>Unité</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let adherent of adherents">
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ adherent.nomAr.charAt(0) }}</div>
                    <div><div class="name">{{ adherent.prenomAr }} {{ adherent.nomAr }}</div><div class="sub">{{ adherent.categorie }}</div></div>
                  </div>
                </td>
                <td>{{ adherent.grade }}</td>
                <td class="mono">{{ adherent.matricule }}</td>
                <td class="mono">{{ adherent.cin }}</td>
                <td class="mono">{{ adherent.matriculeBR }}</td>
                <td>{{ adherent.dernierUnite }}</td>
                <td>
                  <div class="actions">
                    <a class="btn-primary btn-small" [routerLink]="['/module/assurance-sociale/invalidite', adherent.id]">Ajouter invalidité</a>
                    <a class="btn-ghost btn-small" [routerLink]="['/module/assurance-sociale/deces', adherent.id]">Ajouter décès</a>
                  </div>
                </td>
              </tr>
              <tr *ngIf="adherents.length === 0"><td colspan="7" class="empty-row">Aucun adhérent trouvé.</td></tr>
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
    .page-title { font-size:1.35rem; font-weight:700; letter-spacing:-0.02em; }
    .ml-auto { margin-left:auto; }
    .card { background:var(--surface); border:1px solid var(--border); border-radius:var(--r-lg); overflow:hidden; box-shadow:var(--sh-sm); }
    .card__head { padding:1rem 1.25rem; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:1rem; }
    .card__title { font-size:0.95rem; font-weight:700; }
    .search-wrap { display:flex; gap:0.75rem; align-items:center; padding:1rem 1.25rem; flex-wrap:wrap; }
    .search-input { flex:1; min-width:260px; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-md); padding:0.65rem 0.8rem; color:var(--text-1); }
    .btn-primary, .btn-ghost { display:inline-flex; align-items:center; justify-content:center; gap:6px; border-radius:var(--r-md); padding:0.65rem 1rem; font-weight:600; cursor:pointer; text-decoration:none; }
    .btn-primary { background:var(--primary); color:#fff; border:none; }
    .btn-ghost { background:transparent; color:var(--text-2); border:1px solid var(--border); }
    .btn-small { padding:0.45rem 0.7rem; font-size:0.78rem; }
    .pager { display:flex; gap:0.75rem; align-items:center; color:var(--text-2); font-size:0.82rem; }
    .table-wrap { overflow:auto; }
    table { width:100%; border-collapse:collapse; font-size:0.84rem; }
    thead { background:var(--surface-2); }
    th { text-align:left; padding:0.7rem 1rem; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--text-3); border-bottom:1px solid var(--border); }
    td { padding:0.8rem 1rem; border-bottom:1px solid var(--border); vertical-align:middle; }
    tbody tr:hover { background:var(--surface-2); }
    .name-cell { display:flex; align-items:center; gap:10px; }
    .avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#2563eb,#0ea5e9); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; }
    .name { font-weight:600; }
    .sub { font-size:0.75rem; color:var(--text-3); }
    .mono { font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace; }
    .actions { display:flex; gap:0.5rem; flex-wrap:wrap; }
    .empty-row { text-align:center; color:var(--text-3); padding:2rem; }
  `]
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