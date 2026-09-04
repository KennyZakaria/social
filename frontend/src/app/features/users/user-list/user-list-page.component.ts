import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserProfileResponse } from '../../../models';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-user-list-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-list-page.component.html',
  styleUrl: './user-list-page.component.scss'
})
export class UserListPageComponent implements OnInit {
  users: UserProfileResponse[] = [];
  searchTerm = '';
  confirmDeleteId: number | null = null;
  successMsg = '';
  errorMsg = '';

  readonly moduleShortMap: Record<string, string> = {
    MUTUELLE: 'MUT', ASSISTANCE_SOCIALE: 'ASS', CULTURE_LOISIRS: 'CUL',
    RETRAITES: 'RET', DECES: 'DEC', ASSURANCE_SOCIALE: 'AID', BUREAU_ORDRE: 'BO'
  };

  get filtered(): UserProfileResponse[] {
    const q = this.searchTerm.trim().toLowerCase();
    if (!q) return this.users;
    return this.users.filter(u =>
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.matricule.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }

  constructor(private readonly usersService: UsersService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  moduleShort(m: string): string {
    return this.moduleShortMap[m] || m.slice(0, 3);
  }

  startEdit(user: UserProfileResponse): void {
    this.router.navigate(['/users/create'], { queryParams: { id: user.id } });
  }

  doDelete(id: number): void {
    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.confirmDeleteId = null;
        this.loadUsers();
        this.showSuccess('Utilisateur supprimé.');
      },
      error: (e: any) => {
        this.confirmDeleteId = null;
        this.showError(e?.error?.message || 'Erreur lors de la suppression.');
      }
    });
  }

  private loadUsers(): void {
    this.usersService.listUsers().subscribe((rows) => (this.users = rows));
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
