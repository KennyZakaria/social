import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStateService } from '../../../core/auth/auth-state.service';
import { MODULE_MAP } from '../../../core/config/module-map';
import { AppRole } from '../../../core/models/models';
import { AuthApiService } from '../services/auth-api.service';

@Component({
    selector: 'app-signup-page',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './signup-page.component.html',
    styleUrl: './signup-page.component.scss'
})
export class SignupPageComponent {
  error = '';
  loading = false;
  selectedModules = new Set<string>();
  private readonly fb = inject(FormBuilder);

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
