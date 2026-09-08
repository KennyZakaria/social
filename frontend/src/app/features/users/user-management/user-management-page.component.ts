import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MODULE_MAP } from '../../../core/config/module-map';
import { AppRole, UserProfileResponse } from '../../../core/models/models';
import { UsersService } from '../services/users.service';

const DEMO_USERS = [
  { username: 'admin',            password: 'admin123',   role: 'ADMIN',   modules: 'Tous les modules' },
  { username: 'manager',          password: 'manager123', role: 'MANAGER', modules: 'Tous les modules' },
  { username: 'agent.bureau',     password: 'agent123',   role: 'AGENT',   modules: 'Bureau d\'Ordre' },
  { username: 'agent.mutuelle',   password: 'agent123',   role: 'AGENT',   modules: 'Mutuelle, Assurance' },
  { username: 'agent.assistance', password: 'agent123',   role: 'AGENT',   modules: 'Assistance Sociale' },
  { username: 'agent.retraites',  password: 'agent123',   role: 'AGENT',   modules: 'Retraites' },
  { username: 'agent.deces',      password: 'agent123',   role: 'AGENT',   modules: 'Décès' },
  { username: 'agent.culture',    password: 'agent123',   role: 'AGENT',   modules: 'Culture & Loisirs' },
];

@Component({
  selector: 'app-user-management-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management-page.component.html',
  styleUrl: './user-management-page.component.scss'
})
export class UserManagementPageComponent implements OnInit {
  users: UserProfileResponse[] = [];
  selectedModules = new Set<string>();
  editingUser: UserProfileResponse | null = null;
  confirmDeleteId: number | null = null;
  successMsg = '';
  errorMsg = '';
  private readonly fb = inject(FormBuilder);

  readonly demoUsers = DEMO_USERS;

  readonly moduleShortMap: Record<string, string> = {
    MUTUELLE: 'MUT', ASSURANCE_SOCIALE: 'ASS', CULTURE_LOISIRS: 'CUL',
    RETRAITES: 'RET', DECES: 'DEC', ASSISTANCE_SOCIALE: 'AID'
  };

  readonly modules = [
    { label: 'Mutuelle',          value: MODULE_MAP['mutuelle'] },
    { label: 'Assist. Sociale',   value: MODULE_MAP['assistance-sociale'] },
    { label: 'Culture & Loisirs', value: MODULE_MAP['culture-loisirs'] },
    { label: 'Retraites',         value: MODULE_MAP['retraites'] },
    { label: 'Décès',             value: MODULE_MAP['deces'] },
    { label: 'Assur. Sociale',    value: MODULE_MAP['assurance-sociale'] }
  ];

  readonly form = this.fb.nonNullable.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role:     ['AGENT' as AppRole, Validators.required],
    active:   [true]
  });

  constructor(private readonly usersService: UsersService) {}

  ngOnInit(): void { this.loadUsers(); }

  isSelected(module: string): boolean { return this.selectedModules.has(module); }

  toggleModule(module: string, event: Event): void {
    (event.target as HTMLInputElement).checked
      ? this.selectedModules.add(module)
      : this.selectedModules.delete(module);
  }

  moduleShort(m: string): string { return this.moduleShortMap[m] || m.slice(0, 3); }

  startEdit(user: UserProfileResponse): void {
    this.editingUser = user;
    this.form.patchValue({ fullName: user.fullName, username: user.username, email: user.email, password: '', role: user.role, active: user.active });
    this.form.controls.password.clearValidators();
    this.form.controls.password.setValidators([Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
    this.selectedModules = new Set(user.allowedModules);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.resetForm();
  }

  createUser(): void {
    const payload = { ...this.form.getRawValue(), allowedModules: Array.from(this.selectedModules) };
    this.usersService.createUser(payload).subscribe({
      next: () => { this.resetForm(); this.loadUsers(); this.showSuccess('Utilisateur créé avec succès.'); },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors de la création.')
    });
  }

  updateUser(): void {
    if (!this.editingUser) return;
    const raw = this.form.getRawValue();
    const payload: any = {
      fullName: raw.fullName, username: raw.username, email: raw.email,
      role: raw.role, active: raw.active, allowedModules: Array.from(this.selectedModules)
    };
    if (raw.password) payload['password'] = raw.password;
    this.usersService.updateUser(this.editingUser.id, payload).subscribe({
      next: () => { this.cancelEdit(); this.loadUsers(); this.showSuccess('Utilisateur mis à jour.'); },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors de la mise à jour.')
    });
  }

  doToggleActive(user: UserProfileResponse): void {
    this.usersService.toggleActive(user.id).subscribe({
      next: () => { this.loadUsers(); this.showSuccess(`Compte ${user.active ? 'désactivé' : 'activé'}.`); },
      error: (e: any) => this.showError(e?.error?.message || 'Erreur lors du changement de statut.')
    });
  }

  doDelete(id: number): void {
    this.usersService.deleteUser(id).subscribe({
      next: () => { this.confirmDeleteId = null; this.loadUsers(); this.showSuccess('Utilisateur supprimé.'); },
      error: (e: any) => { this.confirmDeleteId = null; this.showError(e?.error?.message || 'Erreur lors de la suppression.'); }
    });
  }

  private resetForm(): void {
    this.form.reset({ fullName: '', username: '', email: '', password: '', role: 'AGENT', active: true });
    this.form.controls.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.form.controls.password.updateValueAndValidity();
    this.selectedModules.clear();
  }

  private loadUsers(): void {
    this.usersService.listUsers().subscribe((rows) => (this.users = rows));
  }

  private showSuccess(msg: string): void {
    this.successMsg = msg; this.errorMsg = '';
    setTimeout(() => (this.successMsg = ''), 4000);
  }

  private showError(msg: string): void {
    this.errorMsg = msg; this.successMsg = '';
    setTimeout(() => (this.errorMsg = ''), 5000);
  }
}
