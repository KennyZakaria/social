import { SimpleDatePipe } from './simple-date.pipe';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RetraiteDossier, RetraitesStoreService } from '../services/retraites-store.service';

@Component({
  selector: 'app-retraites-validation',
  imports: [SimpleDatePipe, CommonModule, RouterLink],
  templateUrl: './retraites-validation.component.html',
  styleUrl: './retraites-validation.component.css'
})
export class RetraitesValidationComponent {
  tab: 'pending' | 'all' = 'pending';
  dossiers: RetraiteDossier[] = [];
  constructor(private readonly store: RetraitesStoreService, private readonly router: Router) { this.store.list().subscribe({ next: rows => this.dossiers = rows }); }
  get pending() { return this.dossiers.filter(d => !d.traite); }
  get displayed() { return this.tab === 'pending' ? this.pending : this.dossiers; }
  openForValidation(dossier: RetraiteDossier) { this.router.navigate(['/module/retraites/dossier', dossier.id], { queryParams: { validation: 'true' } }); }
}
