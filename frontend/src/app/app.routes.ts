import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: 'home', loadComponent: () => import('./features/home/home/home.component').then((m) => m.HomeComponent) },
    { path: '', pathMatch: 'full', redirectTo: 'home' },
	{ path: '', loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES) },
	{ path: '', loadChildren: () => import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES) },
	{ path: '', loadChildren: () => import('./features/bureau-order/bureau-order.routes').then((m) => m.BUREAU_ORDER_ROUTES) },
	{ path: '', loadChildren: () => import('./features/module-cases/module-cases.routes').then((m) => m.MODULE_CASES_ROUTES) },
	{ path: '', loadChildren: () => import('./features/mutuelle/mutuelle.routes').then((m) => m.MUTUELLE_ROUTES) },
	{ path: '', loadChildren: () => import('./features/assistance-sociale/assistance-sociale.routes').then((m) => m.ASSISTANCE_SOCIALE_ROUTES) },
	{ path: '', loadChildren: () => import('./features/culture-loisirs/culture-loisirs.routes').then((m) => m.CULTURE_LOISIRS_ROUTES) },
	{ path: '', loadChildren: () => import('./features/retraites/retraites.routes').then((m) => m.RETRAITES_ROUTES) },
	{ path: '', loadChildren: () => import('./features/assurance-sociale/assurance-sociale.routes').then((m) => m.ASSURANCE_SOCIALE_ROUTES) },
	{ path: '', loadChildren: () => import('./features/users/users.routes').then((m) => m.USERS_ROUTES) },
	{ path: '', loadChildren: () => import('./features/adherents/adherents.routes').then((m) => m.ADHERENTS_ROUTES) },
	{ path: '', loadChildren: () => import('./features/deces/deces.routes').then((m) => m.DECES_ROUTES) },
	{ path: '**', redirectTo: 'home' }
];
