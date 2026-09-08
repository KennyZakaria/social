import { Routes } from '@angular/router';
import { authGuard, managerGuard } from '../../core/auth/guards';
import { AdherentListPageComponent } from './adherent-list/adherent-list-page.component';

export const ADHERENTS_ROUTES: Routes = [
  { path: 'adherents', component: AdherentListPageComponent, canActivate: [authGuard, managerGuard] }
];
