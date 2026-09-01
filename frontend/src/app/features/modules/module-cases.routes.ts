import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../guards';
import { ModulePageComponent } from './pages/module-page.component';

export const MODULE_CASES_ROUTES: Routes = [
  { path: 'module/:moduleKey', component: ModulePageComponent, canActivate: [authGuard, moduleGuard] }
];
