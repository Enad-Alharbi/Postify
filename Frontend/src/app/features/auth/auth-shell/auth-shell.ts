import { Component } from '@angular/core';
import { Logo } from '../../../shared/logo/logo';

// Split layout shared by the login and register pages: hero image on the left, projected form on the right.
@Component({
  selector: 'app-auth-shell',
  imports: [Logo],
  templateUrl: './auth-shell.html',
  styleUrl: './auth-shell.scss',
})
export class AuthShell {
  protected readonly heroImage =
    'https://images.unsplash.com/photo-1756814090379-40855747407d?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1400';
}
