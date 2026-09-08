import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { ModulePageComponent } from './module-page/module-page.component';

export const MODULE_CASES_ROUTES: Routes = [
  { path: 'module/:moduleKey', component: ModulePageComponent, canActivate: [authGuard, moduleGuard] }
];
