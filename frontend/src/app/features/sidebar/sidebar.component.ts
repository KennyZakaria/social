import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStateService } from '../../auth-state.service';

export interface ModuleSubItem {
  label: string;
  route: string | string[];
}

export interface SidebarModule {
  key: string;
  name: string;
  short: string;
  module: string;
  subItems: ModuleSubItem[];
}

@Component({
    selector: 'app-sidebar',
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() modules: SidebarModule[] = [];
  @Input() authState!: AuthStateService;
  @Output() logoutRequested = new EventEmitter<void>();

  readonly decesSubItems: ModuleSubItem[] = [
    { label: 'Tableau de bord', route: '/deces/dashboard' },
    { label: 'Dossiers', route: '/deces/dossiers' },
    { label: 'Nouveau dossier', route: '/deces/nouveau' },
    { label: 'Validation', route: '/deces/validation' },
    { label: 'Ayants droit', route: '/deces/ayants-droit' },
    { label: 'Demandes ayants droit', route: '/deces/demandes' },
    { label: 'Pièces justificatives', route: '/deces/pieces-justificatives' }
  ];

  private readonly expandedModules = new Set<string>();

  isExpanded(moduleKey: string): boolean {
    return this.expandedModules.has(moduleKey);
  }

  toggle(moduleKey: string): void {
    if (this.expandedModules.has(moduleKey)) {
      this.expandedModules.delete(moduleKey);
    } else {
      this.expandedModules.add(moduleKey);
    }
  }

  canSeeModule(moduleName: string): boolean {
    return this.authState.canAccessModule(moduleName);
  }

  logout(): void {
    this.logoutRequested.emit();
  }
}
