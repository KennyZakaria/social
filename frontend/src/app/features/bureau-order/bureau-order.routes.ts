import { Routes } from '@angular/router';
import { authGuard, moduleGuard } from '../../core/auth/guards';
import { BureauOrderPageComponent } from './bureau-order/bureau-order-page.component';

export const BUREAU_ORDER_ROUTES: Routes = [
  { path: 'bureau-order', component: BureauOrderPageComponent, canActivate: [authGuard, moduleGuard], data: { moduleKey: 'bureau-ordre' } }
];
