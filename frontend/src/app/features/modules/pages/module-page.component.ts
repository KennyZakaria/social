import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CaseRecord } from '../../../models';
import { MODULE_LABELS, MODULE_MAP } from '../../../module-map';
import { ModuleCasesService } from '../services/module-cases.service';

@Component({
    selector: 'app-module-page',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page">

      <!-- Page header -->
      <div class="page-header">
        <div class="page-icon page-icon--indigo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Module fonctionnel</p>
          <h2 class="page-title">{{ moduleLabel }}</h2>
        </div>
      </div>

      <!-- Add case form -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Nouveau dossier</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="createCase()" class="form-grid">
          <div class="field">
            <label>Référence</label>
            <input formControlName="referenceCode" placeholder="ex: REF-2025-001" />
          </div>
          <div class="field">
            <label>Intitulé dossier</label>
            <input formControlName="title" placeholder="Titre du dossier" />
          </div>
          <div class="field">
            <label>Nom adhérent</label>
            <input formControlName="memberName" placeholder="Nom de l'adhérent" />
          </div>
          <div class="field">
            <label>Priorité</label>
            <input formControlName="priority" placeholder="ex: NORMALE, HAUTE" />
          </div>
          <div class="field">
            <label>Statut</label>
            <select formControlName="status">
              <option value="OPEN">Ouvert</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="PENDING">En attente</option>
              <option value="COMPLETED">Complété</option>
              <option value="ARCHIVED">Archivé</option>
            </select>
          </div>
          <div class="field">
            <label>Date d'échéance</label>
            <input formControlName="dueDate" type="date" />
          </div>
          <div class="field field--notes">
            <label>Notes</label>
            <textarea formControlName="notes" placeholder="Commentaires et observations..."></textarea>
          </div>
          <div class="field field--action">
            <button class="btn-primary" [disabled]="form.invalid" type="submit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Ajouter le dossier
            </button>
          </div>
        </form>
      </div>

      <!-- Cases table -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Dossiers ({{ cases.length }})</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Référence</th>
                <th>Titre</th>
                <th>Adhérent</th>
                <th>Statut</th>
                <th>Priorité</th>
                <th>Échéance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let c of cases">
                <td><code class="ref-code">{{ c.referenceCode }}</code></td>
                <td class="td-title">{{ c.title }}</td>
                <td>{{ c.memberName }}</td>
                <td>
                  <span class="badge" [class]="'badge--' + c.status.toLowerCase()">
                    {{ statusLabel(c.status) }}
                  </span>
                </td>
                <td>
                  <span class="priority-pill" [class]="'priority--' + (c.priority || 'normale').toLowerCase()">
                    {{ c.priority || 'Normale' }}
                  </span>
                </td>
                <td class="td-date">{{ c.dueDate ? (c.dueDate | date:'dd/MM/yyyy') : '—' }}</td>
              </tr>
              <tr *ngIf="cases.length === 0">
                <td colspan="6" class="empty-row">Aucun dossier enregistré pour ce module.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page { display: flex; flex-direction: column; gap: 1.25rem; }

    .page-header { display: flex; align-items: center; gap: 1rem; }

    .page-icon {
      width: 48px; height: 48px;
      border-radius: var(--r-lg);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      svg { width: 22px; height: 22px; }
    }

    .page-icon--indigo { background: var(--primary-light); color: var(--primary); }

    .page-kicker {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-3);
    }

    .page-title {
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-1);
      margin-top: 2px;
    }

    /* Card */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      overflow: hidden;
      box-shadow: var(--sh-sm);
    }

    .card__head {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card__title { font-size: 0.95rem; font-weight: 700; color: var(--text-1); }

    /* Form */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.875rem;
      padding: 1.25rem;
      align-items: end;
    }

    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 0.78rem; font-weight: 600; color: var(--text-2); }

    .field--notes { grid-column: span 2; }
    .field--action { justify-content: flex-end; }

    /* Button */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: var(--r-md);
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s, transform 0.12s;

      &:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    /* Table */
    .table-wrap { overflow-x: auto; }

    table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }

    thead { background: var(--surface-2); }

    th {
      text-align: left;
      padding: 0.7rem 1rem;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-3);
      border-bottom: 1px solid var(--border);
      white-space: nowrap;
    }

    td {
      padding: 0.8rem 1rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-1);
      vertical-align: middle;
    }

    tbody tr {
      transition: background 0.1s;
      &:hover { background: var(--surface-2); }
      &:last-child td { border-bottom: none; }
    }

    .ref-code {
      font-size: 0.78rem;
      background: var(--primary-light);
      color: var(--primary-dark);
      padding: 2px 7px;
      border-radius: 5px;
    }

    .td-title { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .td-date { font-size: 0.8rem; color: var(--text-2); }

    .priority-pill {
      display: inline-block;
      padding: 2px 9px;
      border-radius: 99px;
      font-size: 0.72rem;
      font-weight: 600;
      background: var(--surface-2);
      color: var(--text-2);
      border: 1px solid var(--border);
    }

    .priority--haute, .priority--high { background: var(--danger-bg); color: var(--danger); border-color: transparent; }
    .priority--moyenne, .priority--medium { background: var(--warning-bg); color: #92400e; border-color: transparent; }
    .priority--basse, .priority--low { background: var(--success-bg); color: #065f46; border-color: transparent; }

    .empty-row { text-align: center; color: var(--text-3); padding: 2rem; }

    @media (max-width: 900px) {
      .form-grid { grid-template-columns: repeat(2, 1fr); }
      .field--notes { grid-column: span 1; }
    }

    @media (max-width: 600px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ModulePageComponent implements OnInit {
  moduleApiKey = 'MUTUELLE';
  moduleLabel = 'Section Mutuelle';
  cases: CaseRecord[] = [];

  readonly form = this.fb.nonNullable.group({
    referenceCode: ['', Validators.required],
    title: ['', Validators.required],
    memberName: ['', Validators.required],
    priority: ['NORMALE', Validators.required],
    status: ['OPEN', Validators.required],
    dueDate: [''],
    notes: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly moduleCasesService: ModuleCasesService,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const routeKey = params.get('moduleKey') || 'mutuelle';
      this.moduleApiKey = MODULE_MAP[routeKey] || 'MUTUELLE';
      this.moduleLabel = MODULE_LABELS[this.moduleApiKey] || this.moduleApiKey;
      this.loadCases();
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      OPEN: 'Ouvert', IN_PROGRESS: 'En cours',
      PENDING: 'En attente', COMPLETED: 'Complété', ARCHIVED: 'Archivé'
    };
    return map[status] || status;
  }

  createCase(): void {
    this.moduleCasesService
      .createCase(this.moduleApiKey, { ...this.form.getRawValue(), module: this.moduleApiKey })
      .subscribe(() => {
        this.form.patchValue({ title: '', memberName: '', notes: '', referenceCode: '', dueDate: '' });
        this.loadCases();
      });
  }

  private loadCases(): void {
    this.moduleCasesService.getCases(this.moduleApiKey).subscribe((rows) => (this.cases = rows));
  }
}
