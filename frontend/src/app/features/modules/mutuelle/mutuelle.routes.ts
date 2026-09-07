import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { ModulePlaceholderPageComponent } from '../pages/module-placeholder-page.component';

export const MUTUELLE_ROUTES: Routes = [
  {
    path: 'module/mutuelle/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'mutuelle' }
  }
];
