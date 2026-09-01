import { Routes } from '@angular/router';
import { authGuard, agentRedirectGuard } from '../../guards';
import { DashboardPageComponent } from './pages/dashboard-page.component';

export const DASHBOARD_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard, agentRedirectGuard] }
];
