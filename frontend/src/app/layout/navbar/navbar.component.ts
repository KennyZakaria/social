import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input({ required: true }) authState!: AuthStateService;
  @Output() logoutRequested = new EventEmitter<void>();

  sectionTitle = 'Espace de travail';
  sectionSubtitle = 'Service Social';
  private routerSubscription?: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.updateSection(this.router.url);
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(event => this.updateSection(event.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  logout(): void {
    this.logoutRequested.emit();
  }

  private updateSection(url: string): void {
    const current = url.split('?')[0];
    const sections: Array<[string, string, string]> = [
      ['/deces', 'Section Décès', 'Gestion des dossiers Décès'],
      ['/retraites', 'Section Retraites', 'Gestion des dossiers Retraites'],
      ['/adherents', 'Adhérents', 'Gestion des adhérents'],
      ['/mutuelle', 'Mutuelle', 'Gestion de la mutuelle'],
      ['/assurance-sociale', 'Assurance sociale', 'Gestion des prestations'],
      ['/assistance-sociale', 'Assistance sociale', 'Gestion des aides sociales'],
      ['/bureau-ordre', 'Bureau d’ordre', 'Gestion du courrier'],
      ['/users', 'Utilisateurs', 'Administration des accès'],
      ['/dashboard', 'Tableau de bord', 'Vue d’ensemble']
    ];
    const match = sections.find(([path]) => current.startsWith(path));
    this.sectionTitle = match?.[1] ?? 'Espace de travail';
    this.sectionSubtitle = match?.[2] ?? 'Service Social';
  }
}