import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { MutuelleAdherentsPageComponent } from './adherents/mutuelle-adherents-page.component';
import { MutuelleDossierFormPageComponent } from './dossier-form/mutuelle-dossier-form-page.component';
import { MutuelleHistoryPageComponent } from './history/mutuelle-history-page.component';

export const MUTUELLE_ROUTES: Routes = [
  {
    path: 'module/mutuelle/adherents',
    component: MutuelleAdherentsPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'mutuelle' }
  },
  {
    path: 'module/mutuelle/dossier/:adherentId',
    component: MutuelleDossierFormPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'mutuelle' }
  },
  {
    path: 'module/mutuelle/historique',
    component: MutuelleHistoryPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'mutuelle' }
  }
];

