import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../guards';
import { DecesDashboardComponent } from './pages/deces-dashboard.component';
import { DossiersListComponent } from './pages/dossiers-list.component';
import { NouveauDossierDecesComponent } from './pages/nouveau-dossier.component';
import { AyantsDroitComponent } from './pages/ayants-droit.component';
import { ValidationComponent } from './pages/validation.component';

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
    path: 'deces/dossiers/:id/ayants-droit',
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
