import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MailRecord } from '../../../models';
import { BureauOrderService } from '../services/bureau-order.service';

@Component({
    selector: 'app-bureau-order-page',
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="page">

      <!-- Page header -->
      <div class="page-header">
        <div class="page-icon page-icon--violet">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
        </div>
        <div>
          <h2 class="page-title">Bureau d'Ordre</h2>
          <p class="page-sub">Gestion des courriers entrants et sortants</p>
        </div>
      </div>

      <!-- New mail form -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Enregistrer un courrier</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="createMail()" class="form-grid">
          <div class="field">
            <label>N° Courrier</label>
            <input formControlName="mailNumber" placeholder="ex: CO-2025-001" />
          </div>
          <div class="field">
            <label>Objet</label>
            <input formControlName="subject" placeholder="Objet du courrier" />
          </div>
          <div class="field">
            <label>Expéditeur</label>
            <input formControlName="senderName" placeholder="Nom expéditeur" />
          </div>
          <div class="field">
            <label>Section destinataire</label>
            <input formControlName="receiverSection" placeholder="Section" />
          </div>
          <div class="field">
            <label>Direction</label>
            <select formControlName="direction">
              <option value="INCOMING">Entrant</option>
              <option value="OUTGOING">Sortant</option>
            </select>
          </div>
          <div class="field">
            <label>Statut</label>
            <select formControlName="status">
              <option value="REGISTERED">Enregistré</option>
              <option value="ASSIGNED">Assigné</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="CLOSED">Clôturé</option>
            </select>
          </div>
          <div class="field field--check">
            <label class="toggle-label">
              <span class="toggle-wrap">
                <input type="checkbox" formControlName="urgent" class="toggle-input" />
                <span class="toggle-track"></span>
              </span>
              Courrier urgent
            </label>
          </div>
          <div class="field field--action">
            <button class="btn-primary" [disabled]="form.invalid" type="submit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Enregistrer
            </button>
          </div>
        </form>
      </div>

      <!-- Search + table -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Courriers ({{ mails.length }})</p>
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input [formControl]="searchControl" class="search-input" placeholder="Recherche multicritère..." (keyup.enter)="search()" />
            <button class="btn-search" (click)="search()">Rechercher</button>
          </div>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Objet</th>
                <th>Expéditeur</th>
                <th>Section</th>
                <th>Direction</th>
                <th>Statut</th>
                <th>Urgent</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of mails">
                <td><code class="ref-code">{{ m.mailNumber }}</code></td>
                <td class="td-subject">{{ m.subject }}</td>
                <td>{{ m.senderName }}</td>
                <td>{{ m.receiverSection }}</td>
                <td>
                  <span class="badge" [class]="'badge--' + m.direction.toLowerCase()">
                    {{ m.direction === 'INCOMING' ? 'Entrant' : 'Sortant' }}
                  </span>
                </td>
                <td>
                  <span class="badge" [class]="'badge--' + m.status.toLowerCase()">
                    {{ statusLabel(m.status) }}
                  </span>
                </td>
                <td>
                  <span *ngIf="m.urgent" class="badge badge--urgent">Urgent</span>
                  <span *ngIf="!m.urgent" class="text-muted">—</span>
                </td>
              </tr>
              <tr *ngIf="mails.length === 0">
                <td colspan="7" class="empty-row">Aucun courrier enregistré.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page { display: flex; flex-direction: column; gap: 1.25rem; }

    .page-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .page-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--r-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      svg { width: 22px; height: 22px; }
    }

    .page-icon--violet { background: var(--purple-bg); color: var(--purple); }

    .page-title {
      font-size: 1.35rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text-1);
    }
    .page-sub { font-size: 0.82rem; color: var(--text-3); margin-top: 2px; }

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
      gap: 1rem;
      flex-wrap: wrap;
    }

    .card__title { font-size: 0.95rem; font-weight: 700; color: var(--text-1); }

    /* Form */
    .form-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.875rem;
      padding: 1.25rem;
      align-items: end;
    }

    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 0.78rem; font-weight: 600; color: var(--text-2); }

    .field--check { justify-content: flex-end; padding-bottom: 2px; }
    .field--action { justify-content: flex-end; }

    /* Toggle */
    .toggle-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-2);
    }

    .toggle-wrap { position: relative; display: inline-block; }
    .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
    .toggle-track {
      display: block;
      width: 36px;
      height: 20px;
      border-radius: 99px;
      background: var(--border-2);
      transition: background 0.2s;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0,0,0,.2);
      }
    }
    .toggle-input:checked + .toggle-track {
      background: var(--primary);
      &::after { transform: translateX(16px); }
    }

    /* Buttons */
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

    /* Search */
    .search-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 10px;
      width: 14px;
      height: 14px;
      color: var(--text-3);
      pointer-events: none;
    }

    .search-input {
      width: 220px;
      padding-left: 2rem;
      font-size: 0.83rem;
    }

    .btn-search {
      background: var(--surface-2);
      border: 1.5px solid var(--border);
      border-radius: var(--r-md);
      padding: 0.55rem 0.875rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-2);
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.15s;

      &:hover { background: var(--border); }
    }

    /* Table */
    .table-wrap { overflow-x: auto; }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.84rem;
    }

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
      font-family: 'Roboto Mono', monospace;
      font-size: 0.78rem;
      background: var(--primary-light);
      color: var(--primary-dark);
      padding: 2px 7px;
      border-radius: 5px;
    }

    .td-subject { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .text-muted { color: var(--text-3); }

    .empty-row { text-align: center; color: var(--text-3); padding: 2rem; }

    @media (max-width: 1100px) {
      .form-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 700px) {
      .form-grid { grid-template-columns: 1fr; }
      .card__head { flex-direction: column; align-items: flex-start; }
      .search-input { width: 100%; }
    }
  `]
})
export class BureauOrderPageComponent implements OnInit {
  mails: MailRecord[] = [];

  readonly searchControl = this.fb.nonNullable.control('');

  readonly form = this.fb.nonNullable.group({
    mailNumber: ['', Validators.required],
    subject: ['', Validators.required],
    senderName: ['', Validators.required],
    receiverSection: ['', Validators.required],
    direction: ['INCOMING' as const, Validators.required],
    status: ['REGISTERED' as const, Validators.required],
    urgent: [false]
  });

  constructor(private readonly fb: FormBuilder, private readonly bureauOrderService: BureauOrderService) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.bureauOrderService.getMails(this.searchControl.value).subscribe((rows) => (this.mails = rows));
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      REGISTERED: 'Enregistré', ASSIGNED: 'Assigné',
      IN_PROGRESS: 'En cours', CLOSED: 'Clôturé'
    };
    return map[status] || status;
  }

  createMail(): void {
    this.bureauOrderService.createMail(this.form.getRawValue()).subscribe(() => {
      this.form.patchValue({
        mailNumber: '', subject: '', senderName: '', receiverSection: '',
        direction: 'INCOMING', status: 'REGISTERED', urgent: false
      });
      this.search();
    });
  }
}
