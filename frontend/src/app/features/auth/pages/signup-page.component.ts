import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../auth-state.service';
import { MODULE_MAP } from '../../../module-map';
import { AppRole } from '../../../models';
import { AuthApiService } from '../services/auth-api.service';

@Component({
    selector: 'app-signup-page',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="signup-wrap">
      <div class="signup-card">
        <div class="card-header">
          <div class="header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div>
            <h3>Créer un compte</h3>
            <p class="card-sub">Renseignez le profil, le rôle et les modules autorisés</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="signup-form">

          <div class="form-section">
            <p class="section-label">Informations personnelles</p>
            <div class="grid-2">
              <div class="field">
                <label>Nom complet</label>
                <input formControlName="fullName" placeholder="ex: Jean Dupont" />
              </div>
              <div class="field">
                <label>Email</label>
                <input formControlName="email" type="email" placeholder="jean@example.com" />
              </div>
              <div class="field">
                <label>Nom d'utilisateur</label>
                <input formControlName="username" placeholder="jean.dupont" />
              </div>
              <div class="field">
                <label>Mot de passe</label>
                <input formControlName="password" type="password" placeholder="Min. 6 caractères" />
              </div>
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Rôle</p>
            <div class="role-grid">
              <label class="role-option" *ngFor="let r of roles" [class.role-option--selected]="form.value.role === r.value">
                <input type="radio" formControlName="role" [value]="r.value" style="display:none" />
                <span class="role-dot" [style.background]="r.color"></span>
                <span class="role-name">{{ r.label }}</span>
                <span class="role-desc">{{ r.desc }}</span>
              </label>
            </div>
          </div>

          <div class="form-section">
            <p class="section-label">Modules autorisés</p>
            <div class="module-grid">
              <label class="module-check" *ngFor="let m of modules" [class.module-check--on]="isSelected(m.value)">
                <input type="checkbox" [checked]="isSelected(m.value)" (change)="toggleModule(m.value, $event)" style="display:none" />
                <span class="check-box">
                  <svg *ngIf="isSelected(m.value)" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                {{ m.label }}
              </label>
            </div>
          </div>

          <div class="error-msg" *ngIf="error">{{ error }}</div>

          <button class="btn-submit" type="submit" [disabled]="form.invalid || loading">
            <span *ngIf="!loading">Créer le compte</span>
            <span *ngIf="loading" class="spinner"></span>
          </button>
        </form>

        <p class="auth-link">Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
      </div>
    </div>
  `,
    styles: [`
    .signup-wrap {
      max-width: 720px;
      margin: 0 auto;
      padding: 0.5rem 0 2rem;
    }

    .signup-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--r-xl);
      box-shadow: var(--sh-md);
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: var(--r-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: #a5b4fc;
    }

    .card-header h3 {
      color: #fff;
      font-size: 1.2rem;
      font-weight: 700;
    }
    .card-sub { color: #a5b4fc; font-size: 0.82rem; margin-top: 2px; }

    .signup-form {
      padding: 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }

    .form-section { display: flex; flex-direction: column; gap: 0.75rem; }

    .section-label {
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-3);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.875rem;
    }

    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 0.8rem; font-weight: 600; color: var(--text-2); }

    .role-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.65rem;
    }

    .role-option {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 0.75rem 1rem;
      border: 1.5px solid var(--border);
      border-radius: var(--r-md);
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;

      &.role-option--selected {
        border-color: var(--primary);
        background: var(--primary-light);
      }
    }

    .role-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-top: 3px;
      flex-shrink: 0;
    }

    .role-name { font-size: 0.85rem; font-weight: 600; color: var(--text-1); }
    .role-desc { font-size: 0.75rem; color: var(--text-3); margin-top: 1px; }

    .role-option { flex-direction: column; gap: 2px;
      .role-dot { margin-bottom: 4px; }
    }

    .module-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.55rem;
    }

    .module-check {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0.55rem 0.75rem;
      border: 1.5px solid var(--border);
      border-radius: var(--r-md);
      cursor: pointer;
      font-size: 0.83rem;
      font-weight: 500;
      color: var(--text-2);
      transition: border-color 0.15s, background 0.15s;

      &.module-check--on {
        border-color: var(--primary);
        background: var(--primary-light);
        color: var(--primary-dark);
      }
    }

    .check-box {
      width: 18px;
      height: 18px;
      border: 1.5px solid var(--border-2);
      border-radius: 5px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface);
      color: var(--primary);
      transition: background 0.12s, border-color 0.12s;

      .module-check--on & {
        background: var(--primary);
        border-color: var(--primary);
        color: #fff;
      }
    }

    .error-msg {
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
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s, transform 0.12s, box-shadow 0.15s;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;

      &:hover:not(:disabled) {
        background: var(--primary-dark);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(99,102,241,0.35);
      }

      &:disabled { opacity: 0.55; cursor: not-allowed; }
    }

    .spinner {
      width: 18px; height: 18px;
      border: 2px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.65s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-link {
      text-align: center;
      padding: 1rem;
      border-top: 1px solid var(--border);
      font-size: 0.85rem;
      color: var(--text-3);
      a { color: var(--primary); font-weight: 600; text-decoration: none; }
      a:hover { text-decoration: underline; }
    }

    @media (max-width: 600px) {
      .grid-2, .module-grid { grid-template-columns: 1fr; }
      .role-grid { grid-template-columns: 1fr; }
      .signup-form { padding: 1.25rem; }
    }
  `]
})
export class SignupPageComponent {
  error = '';
  loading = false;
  selectedModules = new Set<string>();

  readonly roles = [
    { value: 'AGENT' as AppRole,   label: 'Agent',   desc: 'Accès aux modules assignés', color: '#10b981' },
    { value: 'MANAGER' as AppRole, label: 'Manager', desc: 'Bureau d\'ordre + modules',  color: '#f59e0b' }
  ];

  readonly modules = [
    { label: 'Mutuelle',           value: MODULE_MAP['mutuelle'] },
    { label: 'Assistance Sociale', value: MODULE_MAP['assistance-sociale'] },
    { label: 'Culture & Loisirs',  value: MODULE_MAP['culture-loisirs'] },
    { label: 'Retraites',          value: MODULE_MAP['retraites'] },
    { label: 'Décès',              value: MODULE_MAP['deces'] },
    { label: 'Assurance Sociale',  value: MODULE_MAP['assurance-sociale'] }
  ];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['AGENT' as AppRole, Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AuthApiService,
    private readonly authState: AuthStateService,
    private readonly router: Router
  ) {}

  isSelected(module: string): boolean {
    return this.selectedModules.has(module);
  }

  toggleModule(module: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedModules.add(module);
    } else {
      this.selectedModules.delete(module);
    }
  }

  submit(): void {
    this.loading = true;
    this.error = '';
    const payload = {
      ...this.form.getRawValue(),
      allowedModules: Array.from(this.selectedModules)
    };

    this.api.signup(payload).subscribe({
      next: (res) => {
        this.authState.setAuth(res);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.error = 'Impossible de créer le compte.';
      }
    });
  }
}
