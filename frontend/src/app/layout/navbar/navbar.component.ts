import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStateService } from '../../core/auth/auth-state.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  @Input({ required: true }) authState!: AuthStateService;
  @Output() logoutRequested = new EventEmitter<void>();

  logout(): void {
    this.logoutRequested.emit();
  }
}