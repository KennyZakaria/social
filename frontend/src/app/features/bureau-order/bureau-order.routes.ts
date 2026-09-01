import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../guards';
import { BureauOrderPageComponent } from './pages/bureau-order-page.component';

export const BUREAU_ORDER_ROUTES: Routes = [
  { path: 'bureau-order', component: BureauOrderPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'bureau-ordre' } }
];
