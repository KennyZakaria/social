import { Routes } from '@angular/router';
import { adminGuard, authGuard } from '../../guards';
import { UserListPageComponent } from './user-list/user-list-page.component';
import { UserCreatePageComponent } from './user-create/user-create-page.component';

export const USERS_ROUTES: Routes = [
  { path: 'users', component: UserListPageComponent, canActivate: [authGuard, adminGuard] },
  { path: 'users/create', component: UserCreatePageComponent, canActivate: [authGuard, adminGuard] }
];
