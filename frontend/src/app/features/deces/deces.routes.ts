import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { DecesDashboardComponent } from './dashboard/deces-dashboard.component';
import { DossiersListComponent } from './dossiers-list/dossiers-list.component';
import { NouveauDossierDecesComponent } from './nouveau-dossier/nouveau-dossier.component';
import { DemandesDecesComponent } from './demandes/demandes-deces.component';
import { AdherentsDecesComponent } from './adherents/adherents-deces.component';
import { DossierDetailComponent } from './dossier-detail/dossier-detail.component';
import { FicheRenseignementsDecesComponent } from './fiche-renseignements-deces/fiche-renseignements-deces.component';
import { FicheRenseignementsRetraiteComponent } from './fiche-renseignements-retraite/fiche-renseignements-retraite.component';

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
    path: 'deces/dossiers/:id/fiche-renseignements-retraite',
    component: FicheRenseignementsRetraiteComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },  {
    path: 'deces/dossiers/:id/fiche-renseignements',
    component: FicheRenseignementsDecesComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },  
  {
    path: 'deces/dossiers/:dossierId',
    component: DossierDetailComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'deces' }
  },  
  { 
    path: 'deces/demandes', 
    component: DemandesDecesComponent, 
    canActivate: [authGuard, moduleGuard], 
    data: { moduleKey: 'deces' } },


];
