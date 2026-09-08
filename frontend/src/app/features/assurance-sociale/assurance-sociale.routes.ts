import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { AssuranceAdherentsPageComponent } from './adherents/assurance-adherents-page.component';
import { AssuranceRecordFormPageComponent } from './record-form/assurance-record-form-page.component';
import { AssuranceHistoryPageComponent } from './history/assurance-history-page.component';

export const ASSURANCE_SOCIALE_ROUTES: Routes = [
  {
    path: 'module/assurance-sociale/adherents',
    component: AssuranceAdherentsPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assurance-sociale' }
  },
  {
    path: 'module/assurance-sociale/invalidite/:adherentId',
    component: AssuranceRecordFormPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assurance-sociale', recordType: 'INVALIDITE' }
  },
  {
    path: 'module/assurance-sociale/deces/:adherentId',
    component: AssuranceRecordFormPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assurance-sociale', recordType: 'DECES' }
  },
  {
    path: 'module/assurance-sociale/historique',
    component: AssuranceHistoryPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assurance-sociale' }
  }
];
