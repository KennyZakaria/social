import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummary } from '../../../models';
import { MODULE_LABELS } from '../../../module-map';
import { DashboardService } from '../services/dashboard.service';

@Component({
    selector: 'app-dashboard-page',
    imports: [CommonModule],
    template: `
    <div class="dashboard" *ngIf="summary as s; else loading">

      <!-- KPI strip -->
      <div class="kpi-row">
        <div class="kpi kpi--indigo">
          <div class="kpi__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="kpi__body">
            <p class="kpi__label">Dossiers totaux</p>
            <p class="kpi__value">{{ s.totalCases }}</p>
            <p class="kpi__sub">Actifs et archivés</p>
          </div>
        </div>

        <div class="kpi kpi--violet">
          <div class="kpi__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <div class="kpi__body">
            <p class="kpi__label">Courriers bureau d'ordre</p>
            <p class="kpi__value">{{ s.totalMails }}</p>
            <p class="kpi__sub">Entrants et sortants</p>
          </div>
        </div>

        <div class="kpi kpi--emerald">
          <div class="kpi__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div class="kpi__body">
            <p class="kpi__label">Modules actifs</p>
            <p class="kpi__value">{{ moduleKeys(s).length }}</p>
            <p class="kpi__sub">Avec dossiers enregistrés</p>
          </div>
        </div>
      </div>

      <!-- Module breakdown -->
      <div class="card">
        <div class="card__head">
          <div>
            <p class="card__kicker">Répartition</p>
            <h3 class="card__title">Charge par module</h3>
          </div>
        </div>
        <div class="module-list">
          <div class="module-row" *ngFor="let key of moduleKeys(s); let i = index">
            <div class="module-row__left">
              <span class="module-dot" [style.background]="moduleColor(i)"></span>
              <span class="module-name">{{ moduleLabel(key) }}</span>
            </div>
            <div class="module-row__right">
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="barPercent(s, key)" [style.background]="moduleColor(i)"></div>
              </div>
              <span class="module-count">{{ s.moduleCases[key] }}</span>
            </div>
          </div>
          <div class="empty-state" *ngIf="moduleKeys(s).length === 0">
            <p>Aucun dossier enregistré pour le moment.</p>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="skeleton-grid">
        <div class="skeleton kpi-skel" *ngFor="let i of [1,2,3]"></div>
        <div class="skeleton card-skel"></div>
      </div>
    </ng-template>
  `,
    styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 1.25rem; }

    /* KPI row */
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .kpi {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      box-shadow: var(--sh-sm);
      transition: box-shadow 0.2s, transform 0.2s;

      &:hover {
        box-shadow: var(--sh-md);
        transform: translateY(-2px);
      }
    }

    .kpi__icon {
      width: 44px;
      height: 44px;
      border-radius: var(--r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg { width: 22px; height: 22px; }
    }

    .kpi--indigo .kpi__icon { background: var(--primary-light); color: var(--primary); }
    .kpi--violet .kpi__icon { background: var(--purple-bg);    color: var(--purple); }
    .kpi--emerald .kpi__icon { background: var(--success-bg);  color: var(--success); }

    .kpi__body { min-width: 0; }

    .kpi__label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-3);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .kpi__value {
      font-size: 2.2rem;
      font-weight: 800;
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text-1);
      line-height: 1.1;
      margin: 4px 0 2px;
      letter-spacing: -0.03em;
    }

    .kpi--indigo .kpi__value { color: var(--primary-dark); }
    .kpi--violet .kpi__value { color: var(--purple); }
    .kpi--emerald .kpi__value { color: #065f46; }

    .kpi__sub { font-size: 0.76rem; color: var(--text-3); }

    /* Card */
    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-lg);
      overflow: hidden;
      box-shadow: var(--sh-sm);
    }

    .card__head {
      padding: 1.1rem 1.5rem;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .card__kicker {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-3);
    }

    .card__title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-1);
      margin-top: 2px;
    }

    /* Module list */
    .module-list { padding: 0.5rem 0; }

    .module-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.8rem 1.5rem;
      transition: background 0.12s;

      &:hover { background: var(--surface-2); }
    }

    .module-row__left {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 180px;
    }

    .module-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .module-name { font-size: 0.88rem; font-weight: 500; color: var(--text-1); }

    .module-row__right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .bar-track {
      flex: 1;
      height: 6px;
      background: var(--border);
      border-radius: 99px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      border-radius: 99px;
      transition: width 0.6s cubic-bezier(.4,0,.2,1);
      min-width: 4px;
    }

    .module-count {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-2);
      min-width: 28px;
      text-align: right;
    }

    .empty-state {
      padding: 2rem;
      text-align: center;
      color: var(--text-3);
      font-size: 0.88rem;
    }

    /* Skeleton loader */
    .skeleton-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .skeleton {
      background: linear-gradient(90deg, var(--surface-2) 25%, var(--border) 50%, var(--surface-2) 75%);
      background-size: 400% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
      border-radius: var(--r-lg);
    }

    .kpi-skel { height: 100px; }
    .card-skel { height: 280px; }

    @keyframes shimmer {
      0% { background-position: 100% 50%; }
      100% { background-position: -100% 50%; }
    }

    @media (max-width: 900px) {
      .kpi-row { grid-template-columns: 1fr; }
      .module-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
      .module-row__right { width: 100%; }
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  summary?: DashboardSummary;

  private readonly palette = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'];

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => (this.summary = summary),
      error: () => { this.summary = { totalCases: 0, totalMails: 0, moduleCases: {} }; }
    });
  }

  moduleKeys(summary: DashboardSummary): string[] {
    return Object.keys(summary.moduleCases);
  }

  moduleLabel(key: string): string {
    return MODULE_LABELS[key] || key;
  }

  moduleColor(index: number): string {
    return this.palette[index % this.palette.length];
  }

  barPercent(summary: DashboardSummary, key: string): number {
    const max = Math.max(...Object.values(summary.moduleCases));
    return max > 0 ? Math.round((summary.moduleCases[key] / max) * 100) : 0;
  }
}
