import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MODULE_MAP } from '../../../module-map';
import { AppRole, UserProfileResponse } from '../../../models';
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
  template: `
    <div class="page">

      <!-- Alerts -->
      <div class="alert alert--success" *ngIf="successMsg" (click)="successMsg=''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        {{ successMsg }}
      </div>
      <div class="alert alert--error" *ngIf="errorMsg" (click)="errorMsg=''">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {{ errorMsg }}
      </div>

      <!-- Page header -->
      <div class="page-header">
        <div class="page-icon page-icon--emerald">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        </div>
        <div>
          <p class="page-kicker">Administration</p>
          <h2 class="page-title">Gestion des utilisateurs</h2>
        </div>
      </div>

      <!-- Demo credentials -->
      <div class="card demo-card">
        <div class="card__head">
          <p class="card__title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Comptes de démonstration
          </p>
        </div>
        <div class="demo-grid">
          <div class="demo-item" *ngFor="let d of demoUsers">
            <div class="demo-avatar">{{ d.username.charAt(0).toUpperCase() }}</div>
            <div class="demo-info">
              <span class="demo-username">{{ d.username }}</span>
              <span class="demo-pw">{{ d.password }}</span>
            </div>
            <div class="demo-meta">
              <span class="role-badge" [class]="'role--' + d.role.toLowerCase()">{{ d.role }}</span>
              <span class="demo-modules">{{ d.modules }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Create / Edit form -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">{{ editingUser ? 'Modifier l\'utilisateur' : 'Créer un utilisateur' }}</p>
          <button class="btn-ghost" *ngIf="editingUser" (click)="cancelEdit()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Annuler
          </button>
        </div>
        <form [formGroup]="form" (ngSubmit)="editingUser ? updateUser() : createUser()" class="form-body">
          <div class="form-grid">
            <div class="field">
              <label>Nom complet</label>
              <input formControlName="fullName" placeholder="Jean Dupont" />
            </div>
            <div class="field">
              <label>Nom d'utilisateur</label>
              <input formControlName="username" placeholder="jean.dupont" />
            </div>
            <div class="field">
              <label>Email</label>
              <input formControlName="email" type="email" placeholder="jean@example.com" />
            </div>
            <div class="field">
              <label>Mot de passe <span class="hint" *ngIf="editingUser">(laisser vide = inchangé)</span></label>
              <input formControlName="password" type="password" placeholder="Min. 6 caractères" />
            </div>
            <div class="field">
              <label>Rôle</label>
              <select formControlName="role">
                <option value="AGENT">Agent</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div class="field field--check">
              <label class="toggle-label">
                <span class="toggle-wrap">
                  <input type="checkbox" formControlName="active" class="toggle-input" />
                  <span class="toggle-track"></span>
                </span>
                Compte actif
              </label>
            </div>
          </div>

          <div class="modules-section">
            <p class="section-label">Modules autorisés</p>
            <div class="module-grid">
              <label class="module-check" *ngFor="let m of modules" [class.module-check--on]="isSelected(m.value)">
                <input type="checkbox" [checked]="isSelected(m.value)" (change)="toggleModule(m.value, $event)" style="display:none" />
                <span class="check-box">
                  <svg *ngIf="isSelected(m.value)" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
                {{ m.label }}
              </label>
            </div>
          </div>

          <div class="form-footer">
            <button class="btn-primary" [disabled]="form.invalid && !editingUser" type="submit">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
              </svg>
              {{ editingUser ? 'Enregistrer' : 'Créer l\'utilisateur' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Users table -->
      <div class="card">
        <div class="card__head">
          <p class="card__title">Utilisateurs ({{ users.length }})</p>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Modules</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users" [class.row--editing]="editingUser?.id === user.id">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar">{{ user.fullName.charAt(0).toUpperCase() }}</div>
                    <div>
                      <div class="user-name">{{ user.fullName }}</div>
                      <div class="user-username">&#64;{{ user.username }}</div>
                    </div>
                  </div>
                </td>
                <td class="td-email">{{ user.email }}</td>
                <td><span class="role-badge" [class]="'role--' + user.role.toLowerCase()">{{ user.role }}</span></td>
                <td>
                  <div class="modules-cell">
                    <span class="module-tag" *ngFor="let m of user.allowedModules.slice(0,3)">{{ moduleShort(m) }}</span>
                    <span class="module-more" *ngIf="user.allowedModules.length > 3">+{{ user.allowedModules.length - 3 }}</span>
                    <span class="text-muted" *ngIf="user.allowedModules.length === 0">—</span>
                  </div>
                </td>
                <td>
                  <span class="status-dot" [class]="user.active ? 'status-dot--on' : 'status-dot--off'">
                    {{ user.active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <div class="actions-cell">
                    <!-- Edit -->
                    <button class="action-btn action-btn--edit" title="Modifier" (click)="startEdit(user)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <!-- Toggle active -->
                    <button class="action-btn" [class]="user.active ? 'action-btn--warn' : 'action-btn--success'"
                            [title]="user.active ? 'Désactiver' : 'Activer'" (click)="doToggleActive(user)">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path *ngIf="user.active"  d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                        <line *ngIf="user.active"  x1="1" y1="1" x2="23" y2="23"/>
                        <path *ngIf="!user.active" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle *ngIf="!user.active" cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                    <!-- Delete -->
                    <ng-container *ngIf="confirmDeleteId === user.id; else deleteBtn">
                      <button class="action-btn action-btn--danger-confirm" (click)="doDelete(user.id)">Confirmer</button>
                      <button class="action-btn action-btn--cancel" (click)="confirmDeleteId = null">Annuler</button>
                    </ng-container>
                    <ng-template #deleteBtn>
                      <button class="action-btn action-btn--danger" title="Supprimer" (click)="confirmDeleteId = user.id">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                        </svg>
                      </button>
                    </ng-template>
                  </div>
                </td>
              </tr>
              <tr *ngIf="users.length === 0">
                <td colspan="6" class="empty-row">Aucun utilisateur.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { display: flex; flex-direction: column; gap: 1.25rem; }

    /* Alerts */
    .alert {
      display: flex; align-items: center; gap: 10px;
      padding: 0.75rem 1rem; border-radius: var(--r-md);
      font-size: 0.875rem; font-weight: 500; cursor: pointer;
    }
    .alert--success { background: var(--success-bg); color: var(--success); border: 1px solid var(--success); }
    .alert--error   { background: var(--danger-bg);  color: var(--danger);  border: 1px solid var(--danger); }

    /* Page header */
    .page-header { display: flex; align-items: center; gap: 1rem; }
    .page-icon {
      width: 48px; height: 48px; border-radius: var(--r-lg);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
      svg { width: 22px; height: 22px; }
    }
    .page-icon--emerald { background: var(--success-bg); color: var(--success); }
    .page-kicker { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
    .page-title { font-size: 1.35rem; font-weight: 700; letter-spacing: -0.02em; margin-top: 2px; }

    /* Card */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--sh-sm);
    }
    .card__head {
      padding: 1rem 1.25rem; border-bottom: 1px solid var(--border);
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
    }
    .card__title {
      font-size: 0.95rem; font-weight: 700; color: var(--text-1);
      display: flex; align-items: center; gap: 7px;
    }

    /* Demo credentials */
    .demo-card { border-left: 3px solid var(--primary); }
    .demo-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.75rem; padding: 1rem 1.25rem;
    }
    .demo-item {
      display: flex; align-items: center; gap: 10px;
      padding: 0.625rem 0.875rem;
      background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--r-md);
    }
    .demo-avatar {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, var(--primary), #7c3aed);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; color: #fff;
    }
    .demo-info { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
    .demo-username { font-size: 0.8rem; font-weight: 700; color: var(--text-1); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .demo-pw { font-size: 0.72rem; color: var(--text-3); font-family: monospace; }
    .demo-meta { margin-left: auto; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
    .demo-modules { font-size: 0.68rem; color: var(--text-3); white-space: nowrap; }

    /* Form */
    .form-body { padding: 1.25rem; display: flex; flex-direction: column; gap: 1.25rem; }
    .form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.875rem; align-items: end; }
    .field { display: flex; flex-direction: column; gap: 5px; }
    .field label { font-size: 0.78rem; font-weight: 600; color: var(--text-2); display: flex; align-items: center; gap: 5px; }
    .hint { font-size: 0.72rem; font-weight: 400; color: var(--text-3); font-style: italic; }
    .field--check { justify-content: flex-end; padding-bottom: 2px; }

    .toggle-label { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 0.82rem; font-weight: 500; color: var(--text-2); }
    .toggle-wrap { position: relative; display: inline-block; }
    .toggle-input { position: absolute; opacity: 0; width: 0; height: 0; }
    .toggle-track {
      display: block; width: 36px; height: 20px; border-radius: 99px; background: var(--border-2);
      transition: background 0.2s; position: relative;
      &::after { content: ''; position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: #fff; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,.2); }
    }
    .toggle-input:checked + .toggle-track { background: var(--primary); &::after { transform: translateX(16px); } }

    .modules-section { display: flex; flex-direction: column; gap: 8px; }
    .section-label { font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-3); }
    .module-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 0.55rem; }
    .module-check {
      display: flex; align-items: center; gap: 8px; padding: 0.5rem 0.75rem;
      border: 1.5px solid var(--border); border-radius: var(--r-md); cursor: pointer;
      font-size: 0.8rem; font-weight: 500; color: var(--text-2); transition: border-color 0.15s, background 0.15s;
      &.module-check--on { border-color: var(--primary); background: var(--primary-light); color: var(--primary-dark); }
    }
    .check-box {
      width: 16px; height: 16px; border: 1.5px solid var(--border-2); border-radius: 4px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; background: var(--surface); color: var(--primary);
      .module-check--on & { background: var(--primary); border-color: var(--primary); color: #fff; }
    }

    .form-footer { display: flex; justify-content: flex-end; }

    /* Buttons */
    .btn-primary {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--primary); color: #fff; border: none; border-radius: var(--r-md);
      padding: 0.65rem 1.25rem; font-size: 0.875rem; font-weight: 600; cursor: pointer;
      transition: background 0.15s, transform 0.12s;
      &:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 6px;
      background: transparent; color: var(--text-2); border: 1px solid var(--border);
      border-radius: var(--r-md); padding: 0.4rem 0.85rem;
      font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: background 0.15s;
      &:hover { background: var(--surface-2); }
    }

    /* Table */
    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.84rem; }
    thead { background: var(--surface-2); }
    th {
      text-align: left; padding: 0.7rem 1rem;
      font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--text-3); border-bottom: 1px solid var(--border); white-space: nowrap;
    }
    td { padding: 0.8rem 1rem; border-bottom: 1px solid var(--border); color: var(--text-1); vertical-align: middle; }
    tbody tr {
      transition: background 0.1s;
      &:hover { background: var(--surface-2); }
      &:last-child td { border-bottom: none; }
      &.row--editing { background: var(--primary-light); }
    }

    .user-cell { display: flex; align-items: center; gap: 10px; }
    .user-avatar {
      width: 34px; height: 34px; border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), #7c3aed);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.82rem; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    .user-name { font-size: 0.85rem; font-weight: 600; color: var(--text-1); }
    .user-username { font-size: 0.75rem; color: var(--text-3); }
    .td-email { font-size: 0.82rem; color: var(--text-2); }

    .role-badge { display: inline-block; padding: 2px 10px; border-radius: 99px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em; }
    .role--admin   { background: #fce7f3; color: #9d174d; }
    .role--manager { background: var(--warning-bg); color: #92400e; }
    .role--agent   { background: var(--primary-light); color: var(--primary-dark); }

    .modules-cell { display: flex; flex-wrap: wrap; gap: 4px; }
    .module-tag { background: var(--surface-2); border: 1px solid var(--border); color: var(--text-2); padding: 1px 8px; border-radius: 99px; font-size: 0.72rem; font-weight: 600; }
    .module-more { font-size: 0.72rem; color: var(--text-3); font-weight: 600; }

    .status-dot {
      display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 600;
      &::before { content: ''; width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
    }
    .status-dot--on  { color: var(--success); &::before { background: var(--success); } }
    .status-dot--off { color: var(--text-3);  &::before { background: var(--text-3); } }

    /* Action buttons */
    .actions-cell { display: flex; align-items: center; gap: 5px; }
    .action-btn {
      display: inline-flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: var(--r-md);
      border: 1px solid var(--border); background: var(--surface);
      cursor: pointer; transition: background 0.15s, border-color 0.15s; color: var(--text-2);
    }
    .action-btn--edit    { &:hover { background: var(--primary-light); border-color: var(--primary); color: var(--primary); } }
    .action-btn--warn    { &:hover { background: var(--warning-bg); border-color: #f59e0b; color: #92400e; } }
    .action-btn--success { &:hover { background: var(--success-bg); border-color: var(--success); color: var(--success); } }
    .action-btn--danger  { &:hover { background: var(--danger-bg); border-color: var(--danger); color: var(--danger); } }
    .action-btn--danger-confirm {
      width: auto; padding: 0 8px; font-size: 0.72rem; font-weight: 700;
      background: var(--danger); border-color: var(--danger); color: #fff;
      &:hover { opacity: 0.85; }
    }
    .action-btn--cancel {
      width: auto; padding: 0 8px; font-size: 0.72rem; font-weight: 700; color: var(--text-2);
      &:hover { background: var(--surface-2); }
    }

    .text-muted { color: var(--text-3); }
    .empty-row { text-align: center; color: var(--text-3); padding: 2rem; }

    @media (max-width: 1200px) { .module-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 900px)  { .form-grid { grid-template-columns: repeat(2, 1fr); } .module-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px)  { .form-grid { grid-template-columns: 1fr; } .module-grid { grid-template-columns: repeat(2, 1fr); } }
  `]
})
export class UserManagementPageComponent implements OnInit {
  users: UserProfileResponse[] = [];
  selectedModules = new Set<string>();
  editingUser: UserProfileResponse | null = null;
  confirmDeleteId: number | null = null;
  successMsg = '';
  errorMsg = '';

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

  constructor(private readonly fb: FormBuilder, private readonly usersService: UsersService) {}

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
