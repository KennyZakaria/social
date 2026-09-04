import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../guards';
import { DecesDashboardComponent } from './pages/deces-dashboard.component';
import { DossiersListComponent } from './pages/dossiers-list.component';
import { NouveauDossierDecesComponent } from './pages/nouveau-dossier.component';
import { AyantsDroitComponent } from './pages/ayants-droit.component';
import { ValidationComponent } from './pages/validation.component';
import { DemandesDecesComponent } from './pages/demandes-deces.component';
import { PiecesJustificativesComponent } from './pages/pieces-justificatives.component';
import { AdherentsDecesComponent } from './pages/adherents-deces.component';
import { DossierDetailComponent } from './pages/dossier-detail.component';
import { FicheRenseignementsDecesComponent } from './pages/fiche-renseignements-deces.component';

export const DECES_ROUTES: Routes = [
  { path: 'deces', redirectTo: 'deces/dashboard', pathMatch: 'full' },
  {
    path: 'deces/dashboard',
    component: DecesDashboardComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },
  {
    path: 'deces/dossiers',
    component: DossiersListComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },
  {
    path: 'deces/nouveau',
    component: NouveauDossierDecesComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },
  {
    path: 'deces/adherents',
    component: AdherentsDecesComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },
  {
    path: 'deces/dossiers/:id/fiche-renseignements',
    component: FicheRenseignementsDecesComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },  {
    path: 'deces/dossiers/:dossierId',
    component: DossierDetailComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },  { path: 'deces/demandes', component: DemandesDecesComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'deces' } },
  { path: 'deces/pieces-justificatives', component: PiecesJustificativesComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'deces' } },
  {
    path: 'deces/ayants-droit',
    component: AyantsDroitComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },
  {
    path: 'deces/validation',
    component: ValidationComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },
];
