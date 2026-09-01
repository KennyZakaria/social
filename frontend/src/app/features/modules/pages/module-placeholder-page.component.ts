import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-module-placeholder',
    imports: [CommonModule],
    template: `
    <div class="page">
      <div class="page-header">
        <div class="page-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">{{ moduleLabel }}</p>
          <h2 class="page-title">{{ featureTitle }}</h2>
        </div>
      </div>

      <div class="card">
        <div class="placeholder">
          <p>Contenu en cours de développement</p>
          <p class="muted">Cette page est un emplacement réservé. Son contenu sera ajouté ultérieurement.</p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .page { display: flex; flex-direction: column; gap: 1.25rem; }
    .page-header { display: flex; align-items: center; gap: 1rem; }
    .page-icon {
      width: 48px; height: 48px; border-radius: var(--r-lg);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      background: var(--primary-light); color: var(--primary);
      svg { width: 22px; height: 22px; }
    }
    .page-kicker {
      font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--text-3);
    }
    .page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; color: var(--text-1); margin-top: 2px; }
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sh-sm);
    }
    .placeholder {
      padding: 3rem 1.25rem; text-align: center; font-size: 0.9rem; color: var(--text-2);
    }
    .placeholder p { margin: 0 0 0.4rem; }
    .muted { color: var(--text-3); font-size: 0.8rem; }
  `]
})
export class ModulePlaceholderPageComponent {
  moduleLabel = 'Module';
  featureTitle = 'Page';

  constructor(private readonly route: ActivatedRoute) {
    const moduleKey = this.route.snapshot.paramMap.get('moduleKey') || '';
    const feature = this.route.snapshot.paramMap.get('feature') || 'page';
    this.moduleLabel = moduleKey.replace(/-/g, ' ');
    this.featureTitle = feature.replace(/-/g, ' ');
  }
}
