import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { ModulePlaceholderPageComponent } from '../pages/module-placeholder-page.component';

export const ASSURANCE_SOCIALE_ROUTES: Routes = [
  {
    path: 'module/assurance-sociale/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assurance-sociale' }
  }
];
