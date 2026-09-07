import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MODULE_MAP } from '../../../module-map';
import { AppRole, UserProfileRequest, UserProfileResponse } from '../../../models';
import { UsersService } from '../services/users.service';

const DEMO_USERS = [
  { username: 'admin',            password: 'admin123',   role: 'ADMIN',   modules: 'Tous les modules' },
  { username: 'manager',          password: 'manager123', role: 'MANAGER', modules: 'Tous les modules' },
  { username: 'agent.bureau',     password: 'agent123',   role: 'AGENT',   modules: 'Bureau d\'Ordre' },
  { username: 'agent.mutuelle',   password: 'agent123',   role: 'AGENT',   modules: 'Mutuelle' },
  { username: 'agent.assurance',  password: 'agent123',   role: 'AGENT',   modules: 'Assurance Sociale' },
  { username: 'agent.assistance', password: 'agent123',   role: 'AGENT',   modules: 'Assistance Sociale' },
  { username: 'agent.retraites',  password: 'agent123',   role: 'AGENT',   modules: 'Retraites' },
  { username: 'agent.deces',      password: 'agent123',   role: 'AGENT',   modules: 'Décès' },
  { username: 'agent.culture',    password: 'agent123',   role: 'AGENT',   modules: 'Culture & Loisirs' },
];

@Component({
  selector: 'app-user-create-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-create-page.component.html',
  styleUrl: './user-create-page.component.scss'
})
export class UserCreatePageComponent implements OnInit {
  editingUser: UserProfileResponse | null = null;
  selectedModules = new Set<string>();
  successMsg = '';
  errorMsg = '';

  readonly demoUsers = DEMO_USERS;

  readonly modules = [
    { label: 'Mutuelle',          value: MODULE_MAP['mutuelle'] },
    { label: 'Assist. Sociale',   value: MODULE_MAP['assistance-sociale'] },
    { label: 'Culture & Loisirs', value: MODULE_MAP['culture-loisirs'] },
    { label: 'Retraites',         value: MODULE_MAP['retraites'] },
    { label: 'Décès',             value: MODULE_MAP['deces'] },
    { label: 'Assur. Sociale',    value: MODULE_MAP['assurance-sociale'] },
    { label: 'Bureau d\'Ordre',   value: MODULE_MAP['bureau-ordre'] }
  ];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    matricule: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role:     ['AGENT' as AppRole, Validators.required]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.usersService.getUser(+id).subscribe({
        next: (user) => {
          this.editingUser = user;
          this.form.patchValue({
            fullName: user.fullName,
            username: user.username,
            matricule: user.matricule,
            password: '',
            role: user.role
          });
          this.form.controls.password.clearValidators();
          this.form.controls.password.setValidators([Validators.minLength(6)]);
          this.form.controls.password.updateValueAndValidity();
          this.selectedModules = new Set(user.allowedModules);
        },
        error: () => this.router.navigate(['/users'])
      });
    }
  }

  isSelected(module: string): boolean {
    return this.selectedModules.has(module);
  }

  toggleModule(module: string, event: Event): void {
    (event.target as HTMLInputElement).checked
      ? this.selectedModules.add(module)
      : this.selectedModules.delete(module);
  }

  cancelEdit(): void {
    this.router.navigate(['/users']);
  }

  createUser(): void {
    const raw = this.form.getRawValue();
    const payload: UserProfileRequest = {
      fullName: raw.fullName,
      username: raw.username,
      matricule: raw.matricule,
      password: raw.password,
      role: raw.role,
      allowedModules: Array.from(this.selectedModules),
      active: true
    };
    this.usersService.createUser(payload).subscribe({
      next: () => {
        this.showSuccess('Utilisateur créé avec succès.');
        setTimeout(() => this.router.navigate(['/users']), 1000);
      },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors de la création.')
    });
  }

  updateUser(): void {
    if (!this.editingUser) return;
    const raw = this.form.getRawValue();
    const payload: UserProfileRequest = {
      fullName: raw.fullName,
      username: raw.username,
      matricule: raw.matricule,
      role: raw.role,
      allowedModules: Array.from(this.selectedModules),
      active: this.editingUser.active
    };
    if (raw.password) payload.password = raw.password;
    this.usersService.updateUser(this.editingUser.id, payload).subscribe({
      next: () => {
        this.showSuccess('Utilisateur mis à jour.');
        setTimeout(() => this.router.navigate(['/users']), 1000);
      },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors de la mise à jour.')
    });
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg;
    this.errorMsg = '';
    setTimeout(() => (this.successMsg = ''), 4000);
  }

  private showError(msg: string): void {
    this.errorMsg = msg;
    this.successMsg = '';
    setTimeout(() => (this.errorMsg = ''), 5000);
  }
}
