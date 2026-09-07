import { Routes } from '@angular/router';
import { authGuard, managerGuard } from '../../guards';
import { AdherentListPageComponent } from './pages/adherent-list-page.component';

export const ADHERENTS_ROUTES: Routes = [
  { path: 'adherents', component: AdherentListPageComponent, canActivate: [authGuard, managerGuard] }
];
