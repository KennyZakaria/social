import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../auth-state.service';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  @Input() embedded = false;
  @Input() returnUrl: string | null = null;

  error = '';
  loading = false;
  showPassword = false;

  readonly form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly api: AuthApiService,
    private readonly authState: AuthStateService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  submit(): void {
    if (this.form.invalid || this.loading) return;
    this.error = '';
    this.loading = true;

    this.api.login(this.form.getRawValue()).subscribe({
      next: res => {
        this.authState.setAuth(res);
        this.loading = false;
        this.router.navigateByUrl(this.safeReturnUrl() ?? this.resolveHome(res.role, res.allowedModules));
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.message || 'Identifiants invalides.';
      }
    });
  }

  private safeReturnUrl(): string | null {
    const returnUrl = this.returnUrl ?? this.route.snapshot.queryParamMap.get('returnUrl');
    return returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : null;
  }

  private resolveHome(role: string, modules: string[]): string {
    if (role === 'ADMIN') return '/users';
    if (role === 'MANAGER') return '/dashboard';
    if (modules.includes('DECES')) return '/deces/dashboard';
    if (modules.includes('BUREAU_ORDRE')) return '/bureau-order';
    if (modules.includes('MUTUELLE')) return '/module/mutuelle';
    if (modules.includes('ASSISTANCE_SOCIALE')) return '/module/assistance-sociale';
    if (modules.includes('RETRAITES')) return '/module/retraites';
    if (modules.includes('CULTURE_LOISIRS')) return '/module/culture-loisirs';
    if (modules.includes('ASSURANCE_SOCIALE')) return '/module/assurance-sociale';
    return '/dashboard';
  }
}