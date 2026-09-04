import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginPageComponent } from '../auth/pages/login-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, LoginPageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  loginOpen = false;
  selectedReturnUrl = '/dashboard';

  openLogin(event: Event, returnUrl: string): void {
    event.preventDefault();
    this.selectedReturnUrl = returnUrl;
    this.loginOpen = true;
  }

  closeLogin(): void {
    this.loginOpen = false;
  }

}