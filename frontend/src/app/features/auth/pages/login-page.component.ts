import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../auth-state.service';
import { AuthApiService } from '../services/auth-api.service';

@Component({
    selector: 'app-login-page',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="auth-wrap">
      <div class="auth-brand">
        <div class="brand-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <h2>Service Social</h2>
        <p>Accédez à votre espace selon votre profil et vos droits.</p>

        <div class="demo-hint">
          <p class="demo-label">Comptes de démonstration</p>
          <div class="demo-row"><code>admin</code><span>/ admin123 — Accès complet</span></div>
          <div class="demo-row"><code>agent.mutuelle</code><span>/ agent123 — Agent</span></div>
        </div>
      </div>

      <div class="auth-card">
        <h3>Connexion</h3>
        <p class="auth-sub">Entrez vos identifiants pour continuer</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <div class="field">
            <label>Nom d'utilisateur</label>
            <div class="input-icon-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              <input formControlName="username" placeholder="ex: admin" autocomplete="username" />
            </div>
          </div>
          <div class="field">
            <label>Mot de passe</label>
            <div class="input-icon-wrap">
              <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <input formControlName="password" type="password" placeholder="••••••••" autocomplete="current-password" />
            </div>
          </div>

          <div class="error-msg" *ngIf="error">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <button class="btn-submit" type="submit" [disabled]="form.invalid || loading">
            <span *ngIf="!loading">Se connecter</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>
        </form>

        <p class="auth-link">Nouveau compte ? <a routerLink="/signup">Créer un profil</a></p>
      </div>
    </div>
  `,
    styles: [`
    .auth-wrap {
      min-height: calc(100vh - 57px);
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 0;
      margin: -1.5rem -1.75rem -2rem;
    }

    .auth-brand {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%);
      color: #e0e7ff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem 3.5rem;
    }

    .brand-icon {
      width: 56px;
      height: 56px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;
      color: #a5b4fc;
    }

    .auth-brand h2 {
      font-size: 2rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: -0.03em;
      margin-bottom: 0.75rem;
    }

    .auth-brand > p {
      color: #a5b4fc;
      font-size: 1rem;
      line-height: 1.6;
      max-width: 340px;
    }

    .demo-hint {
      margin-top: 2.5rem;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      max-width: 320px;
    }

    .demo-label {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #818cf8;
      margin-bottom: 0.6rem;
    }

    .demo-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      padding: 3px 0;
      code {
        background: rgba(255,255,255,0.15);
        padding: 1px 7px;
        border-radius: 5px;
        font-size: 0.8rem;
        color: #c7d2fe;
      }
      span { color: #a5b4fc; }
    }

    .auth-card {
      background: var(--surface);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 3rem 2.5rem;
    }

    .auth-card h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-1);
      letter-spacing: -0.02em;
    }

    .auth-sub {
      color: var(--text-3);
      margin-top: 0.35rem;
      margin-bottom: 2rem;
      font-size: 0.88rem;
    }

    .auth-form { display: flex; flex-direction: column; gap: 1rem; }

    .field { display: flex; flex-direction: column; gap: 6px; }

    .field label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-2);
    }

    .input-icon-wrap { position: relative; }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 15px;
      height: 15px;
      color: var(--text-3);
      pointer-events: none;
    }

    .input-icon-wrap input { padding-left: 2.25rem; }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--danger);
      background: var(--danger-bg);
      border-radius: var(--r-md);
      padding: 0.6rem 0.875rem;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .btn-submit {
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: var(--r-md);
      padding: 0.7rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 42px;
      margin-top: 0.25rem;

      &:hover:not(:disabled) {
        background: var(--primary-dark);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99,102,241,0.35);
      }

      &:disabled { opacity: 0.55; cursor: not-allowed; }
    }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.65s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-link {
      margin-top: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: var(--text-3);
      a { color: var(--primary); font-weight: 600; text-decoration: none; }
      a:hover { text-decoration: underline; }
    }

    @media (max-width: 900px) {
      .auth-wrap { grid-template-columns: 1fr; }
      .auth-brand { padding: 2rem; }
      .demo-hint { max-width: 100%; }
    }
  `]
})
export class LoginPageComponent {
  error = '';
  loading = false;

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AuthApiService,
    private readonly authState: AuthStateService,
    private readonly router: Router
  ) {}

  private resolveHome(role: string, modules: string[]): string {
    if (role === 'ADMIN')    return '/users';
    if (role === 'MANAGER')  return '/dashboard';
    // AGENT — go to their module
    if (modules.includes('DECES'))            return '/deces/dashboard';
    if (modules.includes('BUREAU_ORDRE'))     return '/bureau-order';
    if (modules.includes('MUTUELLE'))         return '/module/mutuelle';
    if (modules.includes('ASSISTANCE_SOCIALE')) return '/module/assistance-sociale';
    if (modules.includes('RETRAITES'))        return '/module/retraites';
    if (modules.includes('CULTURE_LOISIRS'))  return '/module/culture-loisirs';
    if (modules.includes('ASSURANCE_SOCIALE')) return '/module/assurance-sociale';
    return '/dashboard';
  }

  submit(): void {
    this.error = '';
    this.loading = true;

    this.api.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.authState.setAuth(res);
        this.loading = false;
        this.router.navigate([this.resolveHome(res.role, res.allowedModules)]);
      },
      error: () => {
        this.loading = false;
        this.error = 'Identifiants invalides.';
      }
    });
  }
}
