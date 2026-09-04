import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdherentResponse } from '../../../models';
import { AdherentsService } from '../services/adherents.service';

@Component({
  selector: 'app-adherent-list-page',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page">

      <!-- Alerts -->
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        {{ successMsg }}
      </div>
      <div class="alert alert--error" *ngIf="errorMsg" (click)="errorMsg=''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {{ errorMsg }}
      </div>

      <!-- Page header -->
      <div class="page-header">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Mutuelle</p>
          <h2 class="page-title">Gestion des Adhérents</h2>
        </div>
        <button class="btn-primary ml-auto" (click)="openCreate()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvel adhérent
        </button>
      </div>

      <!-- Search bar -->
      <div class="card">
        <div class="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input class="search-input" [(ngModel)]="searchQuery" [ngModelOptions]="{standalone: true}"
                 placeholder="Rechercher par nom, matricule, CIN…"
                 (input)="onSearch()" />
          <span class="search-count" *ngIf="totalElements > 0">{{ totalElements }} adhérent(s)</span>
        </div>
      </div>

      <!-- Form panel (create / edit) -->
      <div class="card form-card" *ngIf="formOpen">
        <div class="card__head">
          <p class="card__title">{{ editingId ? 'Modifier l\'adhérent' : 'Nouvel adhérent' }}</p>
          <button class="btn-ghost" (click)="closeForm()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Annuler
          </button>
        </div>
        <form [formGroup]="form" (ngSubmit)="saveAdherent()" class="form-body">

          <div class="form-section">
            <p class="section-label">Identité</p>
            <div class="form-grid">
              <div class="field">
                <label>Prénom (AR)</label>
                <input formControlName="prenomAr" placeholder="محمد" dir="rtl"/>
              </div>
              <div class="field">
                <label>Nom (AR)</label>
                <input formControlName="nomAr" placeholder="بوعلي" dir="rtl"/>
              </div>
              <div class="field">
                <label>Date de naissance</label>
                <input formControlName="dateNaissance" type="date"/>
              </div>
              <div class="field">
                <label>Lieu de naissance</label>
                <input formControlName="lieuNaissance" placeholder="Alger"/>
              </div>
              <div class="field">
                <label>CIN</label>
                <input formControlName="cin" placeholder="123456789"/>
              </div>
              <div class="field">
                <label>Email</label>
                <input formControlName="email" type="email" placeholder="exemple@mail.com"/>
              </div>
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Service</p>
            <div class="form-grid">
              <div class="field">
                <label>Catégorie</label>
                <input formControlName="categorie" placeholder="Officier"/>
              </div>
              <div class="field">
                <label>Grade</label>
                <select formControlName="grade">
  <option value="" disabled>Sélectionner un grade</option>
  <optgroup label="Sous-officiers">
    <option value="M/G">M/G</option>
    <option value="M/C">M/C</option>
    <option value="Adj">Adj</option>
    <option value="A/C">A/C</option>
  </optgroup>
  <optgroup label="Officiers">
    <option value="Sous-lieutenant">Sous-lieutenant</option>
    <option value="Lieutenant">Lieutenant</option>
    <option value="Capitaine">Capitaine</option>
  </optgroup>
  <optgroup label="Officiers supérieurs">
    <option value="Commandant">Commandant</option>
    <option value="Lieutenant-colonel">Lieutenant-colonel</option>
    <option value="Colonel">Colonel</option>
    <option value="Colonel-major">Colonel-major</option>
  </optgroup>
  <optgroup label="Officiers généraux">
    <option value="Général de brigade">Général de brigade</option>
    <option value="Général de division">Général de division</option>
  </optgroup>
</select>
              </div>
              <div class="field">
                <label>Matricule BR</label>
                <input formControlName="matriculeBR" placeholder="BR-001"/>
              </div>
              <div class="field">
                <label>Matricule</label>
                <input formControlName="matricule" placeholder="M-001"/>
              </div>
              <div class="field">
                <label>Dernier Unité</label>
                <input formControlName="dernierUnite" placeholder="1ère Région"/>
              </div>
              <div class="field">
                <label>Formation / Unité</label>
                <input formControlName="formationUnite" placeholder="Bataillon X"/>
              </div>
              <div class="field">
                <label>Situation catégorie</label>
                <input formControlName="situationCategorie" placeholder="Actif"/>
              </div>
              <div class="field field--check">
                <label class="toggle-label">
                  <span class="toggle-wrap">
                    <input type="checkbox" formControlName="pension" class="toggle-input"/>
                    <span class="toggle-track"></span>
                  </span>
                  Pension
                </label>
              </div>
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Contact</p>
            <div class="form-grid">
              <div class="field field--wide">
                <label>Adresse</label>
                <input formControlName="adresse" placeholder="Rue, Wilaya"/>
              </div>
              <div class="field">
                <label>Téléphone 1</label>
                <input formControlName="telephone1" placeholder="0555 000 000"/>
              </div>
              <div class="field">
                <label>Téléphone 2 <span class="hint">optionnel</span></label>
                <input formControlName="telephone2" placeholder="0660 000 000"/>
              </div>
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Radiation / Décès <span class="hint">optionnel</span></p>
            <div class="form-grid">
              <div class="field">
                <label>Date de radiation</label>
                <input formControlName="dateRadiation" type="date"/>
              </div>
              <div class="field">
                <label>Motif de radiation</label>
                <input formControlName="motifRadiation" placeholder="Retraite"/>
              </div>
              <div class="field">
                <label>Date de décès</label>
                <input formControlName="dateDeces" type="date"/>
              </div>
              <div class="field">
                <label>Cause de décès</label>
                <input formControlName="causeDeces" placeholder="Maladie"/>
              </div>
            </div>
          </div>

          <div class="form-footer">
            <button class="btn-primary" type="submit" [disabled]="form.invalid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              {{ editingId ? 'Enregistrer' : 'Créer' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Table -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Adhérents ({{ totalElements }})</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nom &amp; Prénom</th>
                <th>Matricule</th>
                <th>Catégorie / Grade</th>
                <th>CIN</th>
                <th>Téléphone</th>
                <th>Situation</th>
                <th>Pension</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of adherents" [class.row--editing]="editingId === a.id">
                <td>
                  <div class="name-cell">
                    <div class="avatar">{{ a.nomAr.charAt(0) }}</div>
                    <div>
                      <div class="name-ar">{{ a.prenomAr }} {{ a.nomAr }}</div>
                      <div class="name-sub">{{ a.email }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="mat-cell">
                    <span class="mat-tag">{{ a.matricule }}</span>
                    <span class="mat-sub">BR: {{ a.matriculeBR }}</span>
                  </div>
                </td>
                <td>
                  <div>
                    <span class="cat-badge">{{ a.categorie }}</span>
                    <div class="grade-sub">{{ a.grade }}</div>
                  </div>
                </td>
                <td class="td-mono">{{ a.cin }}</td>
                <td class="td-phone">{{ a.telephone1 }}</td>
                <td>
                  <span class="sit-badge" [class]="getSitClass(a.situationCategorie)">{{ a.situationCategorie }}</span>
                </td>
                <td>
                  <span class="pension-dot" [class]="a.pension ? 'pension-dot--on' : 'pension-dot--off'">
                    {{ a.pension ? 'Oui' : 'Non' }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn action-btn--edit" title="Modifier" (click)="startEdit(a)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <ng-container *ngIf="confirmDeleteId === a.id; else delBtn">
                      <button class="action-btn action-btn--danger-confirm" (click)="doDelete(a.id)">Confirmer</button>
                      <button class="action-btn action-btn--cancel" (click)="confirmDeleteId = null">Annuler</button>
                    </ng-container>
                    <ng-template #delBtn>
                      <button class="action-btn action-btn--danger" title="Supprimer" (click)="confirmDeleteId = a.id">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </ng-template>
                  </div>
                </td>
              </tr>
              <tr *ngIf="adherents.length === 0 && !loading">
                <td colspan="8" class="empty-row">Aucun adhérent trouvé.</td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="8" class="empty-row">Chargement…</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" *ngIf="totalPages > 1">
          <button class="page-btn" [disabled]="currentPage === 0" (click)="goPage(0)">«</button>
          <button class="page-btn" [disabled]="currentPage === 0" (click)="goPage(currentPage - 1)">‹</button>
          <span class="page-info">Page {{ currentPage + 1 }} / {{ totalPages }}</span>
          <button class="page-btn" [disabled]="currentPage === totalPages - 1" (click)="goPage(currentPage + 1)">›</button>
          <button class="page-btn" [disabled]="currentPage === totalPages - 1" (click)="goPage(totalPages - 1)">»</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 1.25rem; }

    /* Alerts */
    .alert { display: flex; align-items: center; gap: 10px; padding: 0.75rem 1rem; border-radius: var(--r-md); font-size: 0.875rem; font-weight: 500; cursor: pointer; }
    .alert--success { background: var(--success-bg); color: var(--success); border: 1px solid var(--success); }
    .alert--error   { background: var(--danger-bg);  color: var(--danger);  border: 1px solid var(--danger); }

    /* Page header */
    .page-header { display: flex; align-items: center; gap: 1rem; }
    .page-icon {
      width: 48px; height: 48px; border-radius: var(--r-lg); flex-shrink: 0;
      background: var(--info-bg, #eff6ff); color: var(--info, #3b82f6);
      display: flex; align-items: center; justify-content: center;
      svg { width: 22px; height: 22px; }
    }
    .page-kicker { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
    .page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; }
    .ml-auto { margin-left: auto; }

    /* Card */
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sh-sm); }
    .card__head { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .card__title { font-size: 0.95rem; font-weight: 700; color: var(--text-1); }
    .form-card { border-left: 3px solid var(--primary); }

    /* Search */
    .search-bar { display: flex; align-items: center; gap: 10px; padding: 0.875rem 1.25rem; color: var(--text-3); }
    .search-input { flex: 1; border: none; outline: none; background: transparent; font-size: 0.9rem; color: var(--text-1); }
    .search-count { font-size: 0.8rem; font-weight: 600; color: var(--text-3); white-space: nowrap; }

    /* Form */
    .form-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .form-section { display: flex; flex-direction: column; gap: 0.75rem; }
    .section-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); display: flex; align-items: center; gap: 6px; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.875rem; align-items: end; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field--wide { grid-column: span 2; }
    .field label { font-size: 0.78rem; font-weight: 600; color: var(--text-2); display: flex; align-items: center; gap: 5px; }
    .hint { font-size: 0.72rem; font-weight: 400; color: var(--text-3); font-style: italic; }
    .field--check { justify-content: flex-end; padding-bottom: 2px; }

    .toggle-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 500; color: var(--text-2); }
    .toggle-wrap { position: relative; display: inline-block; }
    .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
    .toggle-track {
      display: block; width: 36px; height: 20px; border-radius: 99px; background: var(--border-2);
      transition: background 0.2s; position: relative;
      &::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform 0.2s; }
    }
    .toggle-input:checked + .toggle-track { background: var(--primary); &::after { transform: translateX(16px); } }

    .form-footer { display: flex; justify-content: flex-end; }

    /* Buttons */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 6px; background: var(--primary); color: #fff; border: none;
      border-radius: var(--r-md); padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
      transition: background 0.15s, transform 0.12s;
      &:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 6px; background: transparent; color: var(--text-2);
      border: 1px solid var(--border); border-radius: var(--r-md); padding: 0.4rem 0.85rem;
      font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s;
      &:hover { background: var(--surface-2); }
    }

    /* Table */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
    thead { background: var(--surface-2); }
    th { text-align: left; padding: 0.7rem 1rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-3); border-bottom: 1px solid var(--border); white-space: nowrap; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); color: var(--text-1); vertical-align: middle; }
    tbody tr { transition: background 0.1s; &:hover { background: var(--surface-2); } &:last-child td { border-bottom: none; } &.row--editing { background: var(--primary-light); } }

    .name-cell { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 700; color: #fff;
    }
    .name-ar { font-size: 0.88rem; font-weight: 600; direction: rtl; }
    .name-sub { font-size: 0.73rem; color: var(--text-3); }

    .mat-cell { display: flex; flex-direction: column; gap: 2px; }
    .mat-tag { font-size: 0.8rem; font-weight: 700; color: var(--primary); }
    .mat-sub { font-size: 0.72rem; color: var(--text-3); }

    .cat-badge { display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 0.72rem; font-weight: 700; background: #eff6ff; color: #1d4ed8; }
    .grade-sub { font-size: 0.75rem; color: var(--text-3); margin-top: 2px; }

    .td-mono { font-family: monospace; font-size: 0.82rem; }
    .td-phone { font-size: 0.82rem; color: var(--text-2); }

    .sit-badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 0.72rem; font-weight: 700; }
    .sit--actif     { background: var(--success-bg); color: var(--success); }
    .sit--radié     { background: var(--warning-bg); color: #92400e; }
    .sit--décédé    { background: var(--danger-bg);  color: var(--danger); }
    .sit--default   { background: var(--surface-2);  color: var(--text-2); }

    .pension-dot { display: inline-flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; &::before { content: ''; width: 7px; height: 7px; border-radius: 50%; display: inline-block; } }
    .pension-dot--on  { color: var(--success); &::before { background: var(--success); } }
    .pension-dot--off { color: var(--text-3);  &::before { background: var(--text-3); } }

    /* Action buttons */
    .actions-cell { display: flex; align-items: center; gap: 5px; }
    .action-btn { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: var(--r-md); border: 1px solid var(--border); background: var(--surface); cursor: pointer; transition: background 0.15s, border-color 0.15s; color: var(--text-2); }
    .action-btn--edit    { &:hover { background: var(--primary-light); border-color: var(--primary); color: var(--primary); } }
    .action-btn--danger  { &:hover { background: var(--danger-bg); border-color: var(--danger); color: var(--danger); } }
    .action-btn--danger-confirm { width: auto; padding: 0 8px; font-size: 0.72rem; font-weight: 700; background: var(--danger); border-color: var(--danger); color: #fff; &:hover { opacity: 0.85; } }
    .action-btn--cancel { width: auto; padding: 0 8px; font-size: 0.72rem; font-weight: 700; color: var(--text-2); &:hover { background: var(--surface-2); } }

    /* Pagination */
    .pagination { display: flex; align-items: center; gap: 6px; padding: 0.875rem 1.25rem; border-top: 1px solid var(--border); justify-content: center; }
    .page-btn { width: 32px; height: 32px; border-radius: var(--r-md); border: 1px solid var(--border); background: var(--surface); cursor: pointer; font-size: 0.85rem; font-weight: 600; color: var(--text-2); transition: background 0.15s; &:hover:not(:disabled) { background: var(--primary-light); color: var(--primary); border-color: var(--primary); } &:disabled { opacity: 0.4; cursor: not-allowed; } }
    .page-info { font-size: 0.82rem; color: var(--text-2); padding: 0 8px; }

    .empty-row { text-align: center; color: var(--text-3); padding: 2.5rem; }

    @media (max-width: 900px) { .form-grid { grid-template-columns: repeat(2, 1fr); } .field--wide { grid-column: span 2; } }
    @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .field--wide { grid-column: span 1; } }
  `]
})
export class AdherentListPageComponent implements OnInit {
  adherents: AdherentResponse[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  loading = false;
  searchQuery = '';
  formOpen = false;
  editingId: number | null = null;
  confirmDeleteId: number | null = null;
  successMsg = '';
  errorMsg = '';

  private searchTimer: any;

  readonly form = this.fb.nonNullable.group({
    prenomAr:          ['', Validators.required],
    nomAr:             ['', Validators.required],
    categorie:         ['', Validators.required],
    grade:             ['', Validators.required],
    matriculeBR:       ['', Validators.required],
    matricule:         ['', Validators.required],
    dateNaissance:     ['', Validators.required],
    lieuNaissance:     ['', Validators.required],
    dateRadiation:     [null as string | null],
    motifRadiation:    [null as string | null],
    dateDeces:         [null as string | null],
    causeDeces:        [null as string | null],
    dernierUnite:      ['', Validators.required],
    formationUnite:    ['', Validators.required],
    telephone1:        ['', Validators.required],
    telephone2:        [null as string | null],
    adresse:           ['', Validators.required],
    email:             ['', [Validators.required, Validators.email]],
    situationCategorie:['', Validators.required],
    pension:           [false],
    cin:               ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder, private readonly svc: AdherentsService) {}

  ngOnInit(): void { this.load(); }

  onSearch(): void {
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => { this.currentPage = 0; this.load(); }, 350);
  }

  goPage(p: number): void { this.currentPage = p; this.load(); }

  openCreate(): void {
    this.editingId = null;
    this.form.reset({ pension: false });
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startEdit(a: AdherentResponse): void {
    this.editingId = a.id;
    this.form.patchValue({ ...a } as any);
    this.formOpen = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeForm(): void { this.formOpen = false; this.editingId = null; this.form.reset({ pension: false }); }

  saveAdherent(): void {
    const payload = this.form.getRawValue() as any;
    const obs = this.editingId
      ? this.svc.update(this.editingId, payload)
      : this.svc.create(payload);
    obs.subscribe({
      next: () => { this.closeForm(); this.load(); this.showSuccess(this.editingId ? 'Adhérent mis à jour.' : 'Adhérent créé.'); },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors de l\'enregistrement.')
    });
  }

  doDelete(id: number): void {
    this.svc.delete(id).subscribe({
      next: () => { this.confirmDeleteId = null; this.load(); this.showSuccess('Adhérent supprimé.'); },
      error: (e: any) => { this.confirmDeleteId = null; this.showError(e?.error?.message || 'Erreur lors de la suppression.'); }
    });
  }

  getSitClass(sit: string): string {
    const s = (sit || '').toLowerCase();
    if (s.includes('actif')) return 'sit-badge sit--actif';
    if (s.includes('radi')) return 'sit-badge sit--radié';
    if (s.includes('déc') || s.includes('dec')) return 'sit-badge sit--décédé';
    return 'sit-badge sit--default';
  }

  private load(): void {
    this.loading = true;
    this.svc.list(this.searchQuery, this.currentPage).subscribe({
      next: (p) => {
        this.adherents     = p.content;
        this.totalElements = p.totalElements;
        this.totalPages    = p.totalPages;
        this.loading       = false;
      },
      error: () => { this.loading = false; }
    });
  }

  private showSuccess(msg: string): void { this.successMsg = msg; this.errorMsg = ''; setTimeout(() => (this.successMsg = ''), 4000); }
  private showError(msg: string): void   { this.errorMsg = msg; this.successMsg = ''; setTimeout(() => (this.errorMsg = ''), 5000); }
}
