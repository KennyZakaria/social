import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStateService } from './auth-state.service';
import { MODULE_MAP } from './module-map';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);

  if (auth.isAuthenticated) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);

  if (auth.hasRole('ADMIN') || auth.hasRole('MANAGER')) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};

export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);

  if (auth.hasRole('MANAGER')) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};

export const agentRedirectGuard: CanActivateFn = () => {
  const auth = inject(AuthStateService);
  const router = inject(Router);

  if (auth.hasRole('ADMIN')) return router.createUrlTree(['/users']);

  if (!auth.hasRole('AGENT')) return true;

  const mods = auth.auth?.allowedModules ?? [];
  if (mods.includes('DECES'))              return router.createUrlTree(['/deces/dashboard']);
  if (mods.includes('BUREAU_ORDRE'))       return router.createUrlTree(['/bureau-order']);
  if (mods.includes('MUTUELLE'))           return router.createUrlTree(['/module/mutuelle']);
  if (mods.includes('ASSISTANCE_SOCIALE')) return router.createUrlTree(['/module/assistance-sociale']);
  if (mods.includes('RETRAITES'))          return router.createUrlTree(['/module/retraites']);
  if (mods.includes('CULTURE_LOISIRS'))    return router.createUrlTree(['/module/culture-loisirs']);
  if (mods.includes('ASSURANCE_SOCIALE'))  return router.createUrlTree(['/module/assurance-sociale']);
  return true;
};

export const moduleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthStateService);
  const router = inject(Router);
  const moduleKey = (route.params['moduleKey'] || route.data['moduleKey']) as string;
  const moduleName = MODULE_MAP[moduleKey];

  if (!moduleName) {
    return router.createUrlTree(['/dashboard']);
  }

  if (auth.canAccessModule(moduleName)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
