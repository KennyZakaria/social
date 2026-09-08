import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CaseRecord } from '../../../core/models/models';
import { MODULE_LABELS, MODULE_MAP } from '../../../core/config/module-map';
import { ModuleCasesService } from '../services/module-cases.service';

@Component({
    selector: 'app-module-page',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './module-page.component.html',
    styleUrl: './module-page.component.scss'
})
export class ModulePageComponent implements OnInit {
  moduleApiKey = 'MUTUELLE';
  moduleLabel = 'Section Mutuelle';
  cases: CaseRecord[] = [];
  private readonly fb = inject(FormBuilder);

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
