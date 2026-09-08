import { Routes } from '@angular/router';
import { authGuard, agentRedirectGuard } from '../../core/auth/guards';
import { DashboardPageComponent } from './dashboard/dashboard-page.component';

export const DASHBOARD_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard, agentRedirectGuard] }
];
