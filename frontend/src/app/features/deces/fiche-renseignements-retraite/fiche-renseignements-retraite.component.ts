import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { AdherentResponse, DossierDecesResponse, FicheRenseignementsDeces } from '../../../core/models/models';
import { DecesService } from '../services/deces.service';

@Component({
  selector: 'app-fiche-renseignements-retraite',
  imports: [CommonModule, RouterLink],
  templateUrl: './fiche-renseignements-retraite.component.html',
  styleUrl: './fiche-renseignements-retraite.component.scss'
})
export class FicheRenseignementsRetraiteComponent implements OnInit {
  dossier: DossierDecesResponse | null = null;
  adherent: AdherentResponse | null = null;
  fiche: FicheRenseignementsDeces | null = null;
  loading = true;
  error = '';

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly deces: DecesService) {}

  get dossierId(): number { return Number(this.route.snapshot.paramMap.get('id')); }

  ngOnInit(): void {
    if (!this.dossierId) { this.router.navigate(['/deces/dossiers']); return; }
    this.deces.findById(this.dossierId).pipe(
      switchMap(dossier => {
        this.dossier = dossier;
        return forkJoin({
          adherent: this.deces.getAdherent(dossier.adherentId),
          fiche: this.deces.getFiche(dossier.id).pipe(catchError(() => of(null)))
        });
      }),
      finalize(() => this.loading = false)
    ).subscribe({
      next: result => {
        this.adherent = result.adherent;
        this.fiche = result.fiche;
        if (this.adherent.situationCategorie !== 'RETRAITE') this.error = 'Cette fiche est réservée aux adhérents retraités.';
      },
      error: () => this.error = 'Impossible de charger la fiche de renseignements retraité.'
    });
  }

  formatDate(value?: string | null): string {
    if (!value) return '—';
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : value;
  }

  print(): void { window.print(); }
}