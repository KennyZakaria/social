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
  // Every authenticated profile starts on the shared dashboard.
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
