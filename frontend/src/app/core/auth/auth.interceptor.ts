import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from './auth-state.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authState = inject(AuthStateService);
  const router = inject(Router);
  const token = authState.token;

  if (!token) {
    return next(req);
  }

  const withAuth = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(withAuth).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.includes('/api/auth/login')) {
        authState.logout();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => error);
    })
  );
};
