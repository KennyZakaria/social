import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../../guards';
import { ModulePlaceholderPageComponent } from '../pages/module-placeholder-page.component';

export const CULTURE_LOISIRS_ROUTES: Routes = [
  {
    path: 'module/culture-loisirs/:feature',
    component: ModulePlaceholderPageComponent,
    canActivate: [authGuard, moduleGuard],
    data: { moduleKey: 'culture-loisirs' }
  }
];
