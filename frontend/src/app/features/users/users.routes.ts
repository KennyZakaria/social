import { Routes } from '@angular/router';
import { adminGuard, authGuard } from '../../guards';
import { UserManagementPageComponent } from './pages/user-management-page.component';

export const USERS_ROUTES: Routes = [
  { path: 'users', component: UserManagementPageComponent, canActivate: [authGuard, adminGuard] }
];
