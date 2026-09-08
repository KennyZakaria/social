import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { ModulePlaceholderPageComponent } from '../module-cases/module-placeholder/module-placeholder-page.component';

export const CULTURE_LOISIRS_ROUTES: Routes = [
  {
    path: 'module/culture-loisirs/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'culture-loisirs' }
  }
];
