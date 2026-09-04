import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthStateService } from './auth-state.service';
import { MODULE_MAP } from './module-map';
import { SidebarComponent, SidebarModule } from './features/sidebar/sidebar.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, SidebarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly modules: SidebarModule[] = [
    { key: 'mutuelle', name: 'Section Mutuelle', short: 'MU', module: MODULE_MAP['mutuelle'], subItems: [
      { label: 'Adhérents', route: ['/module', 'mutuelle', 'adherents'] },
      { label: 'Historique Courrier', route: ['/module', 'mutuelle', 'historique'] }
    ]},
    { key: 'assistance-sociale', name: 'Assistance Sociale', short: 'AS', module: MODULE_MAP['assistance-sociale'], subItems: [
      { label: 'Dossiers', route: ['/module', 'assistance-sociale', 'dossiers'] },
      { label: 'Enquêtes', route: ['/module', 'assistance-sociale', 'enquetes'] }
    ]},
    { key: 'culture-loisirs', name: 'Culture et Loisirs', short: 'CL', module: MODULE_MAP['culture-loisirs'], subItems: [
      { label: 'Activités', route: ['/module', 'culture-loisirs', 'activites'] },
      { label: 'Événements', route: ['/module', 'culture-loisirs', 'evenements'] }
    ]},
    { key: 'retraites', name: 'Section Retraites', short: 'RE', module: MODULE_MAP['retraites'], subItems: [
      { label: 'Dossiers', route: ['/module', 'retraites', 'dossiers'] }
    ]},
    { key: 'assurance-sociale', name: 'Assurance Sociale', short: 'AN', module: MODULE_MAP['assurance-sociale'], subItems: [
      { label: 'Adhérents', route: ['/module', 'assurance-sociale', 'adherents'] },
      { label: 'Historique', route: ['/module', 'assurance-sociale', 'historique'] }
    ]}
  ];

  isPublicPage = false;

  constructor(public readonly authState: AuthStateService, private readonly router: Router) {
    this.updatePublicPage();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.updatePublicPage();
    });
  }

  private updatePublicPage(): void {
    this.isPublicPage = this.router.url === '/' || this.router.url === '/home' || this.router.url.startsWith('/login');
  }

  logout(): void {
    this.authState.logout();
    this.router.navigate(['/login']);
  }
}
