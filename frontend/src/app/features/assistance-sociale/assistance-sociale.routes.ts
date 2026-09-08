import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { ModulePlaceholderPageComponent } from '../module-cases/module-placeholder/module-placeholder-page.component';

export const ASSISTANCE_SOCIALE_ROUTES: Routes = [
  {
    path: 'module/assistance-sociale/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assistance-sociale' }
  }
];
