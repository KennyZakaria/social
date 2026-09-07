import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { RetraitesPageComponent } from './pages/retraites-page.component';
import { RetraitesListPageComponent } from './pages/retraites-list-page.component';
import { RetraitesGlobalHistoryPageComponent } from './pages/retraites-global-history-page.component';
import { RetraitesDashboardComponent } from './pages/retraites-dashboard.component';
import { RetraitesValidationComponent } from './pages/retraites-validation.component';

export const RETRAITES_ROUTES: Routes = [
  { path: 'retraites', redirectTo: 'retraites/dashboard', pathMatch: 'full' },
  { path: 'retraites/dashboard', component: RetraitesDashboardComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  { path: 'retraites/dossiers', component: RetraitesListPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  { path: 'retraites/nouveau', component: RetraitesPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites', newDossier: true } },
  { path: 'retraites/validation', component: RetraitesValidationComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  { path: 'module/retraites/dossier/:id', component: RetraitesPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  { path: 'module/retraites/dossiers', component: RetraitesListPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  { path: 'module/retraites/historique-global', component: RetraitesGlobalHistoryPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  { path: 'module/retraites', pathMatch: 'full', component: RetraitesListPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'retraites' } },
  {
    path: 'module/retraites/:feature',
    component: RetraitesPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'retraites' }
  }
];
