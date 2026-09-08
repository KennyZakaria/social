import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from './models';

const AUTH_STORAGE_KEY = 'social_auth';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly authSubject = new BehaviorSubject<AuthResponse | null>(this.loadFromStorage());
  readonly auth$ = this.authSubject.asObservable();

  get auth(): AuthResponse | null {
    return this.authSubject.value;
  }

  get token(): string | null {
    return this.auth?.token ?? null;
  }

  get isAuthenticated(): boolean {
    return !!this.auth?.token;
  }

  setAuth(auth: AuthResponse): void {
    this.authSubject.next(auth);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  }

  logout(): void {
    this.authSubject.next(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  hasRole(role: string): boolean {
    return this.auth?.role === role;
  }

  canAccessModule(module: string): boolean {
    if (this.hasRole('ADMIN')) {
      return true;
    }
    return !!this.auth?.allowedModules?.includes(module);
  }

  private loadFromStorage(): AuthResponse | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }
  }
}
