import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { ModulePlaceholderPageComponent } from '../pages/module-placeholder-page.component';

export const ASSISTANCE_SOCIALE_ROUTES: Routes = [
  {
    path: 'module/assistance-sociale/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'assistance-sociale' }
  }
];
