import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardSummary } from '../../../core/models/models';
import { MODULE_LABELS } from '../../../core/config/module-map';
import { DashboardService } from '../services/dashboard.service';

@Component({
    selector: 'app-dashboard-page',
    imports: [CommonModule],
    templateUrl: './dashboard-page.component.html',
    styleUrl: './dashboard-page.component.scss'
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
