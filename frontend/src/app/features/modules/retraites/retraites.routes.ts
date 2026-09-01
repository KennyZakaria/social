import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { ModulePlaceholderPageComponent } from '../pages/module-placeholder-page.component';

export const RETRAITES_ROUTES: Routes = [
  {
    path: 'module/retraites/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'retraites' }
  }
];
