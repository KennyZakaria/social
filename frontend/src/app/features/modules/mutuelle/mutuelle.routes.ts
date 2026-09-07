import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { MutuelleAdherentsPageComponent } from './pages/mutuelle-adherents-page.component';
import { MutuelleDossierFormPageComponent } from './pages/mutuelle-dossier-form-page.component';
import { MutuelleHistoryPageComponent } from './pages/mutuelle-history-page.component';

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

