import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

// Temporary protected page to verify the auth flow; replaced by the real feed in milestone 3.
@Component({
  selector: 'app-feed',
  template: `
    <main class="page">
      <p class="eyebrow">YOUR COMMUNITY</p>
      <h1>Hello, {{ auth.currentUser()?.firstName }}.</h1>
      <p>Signed in as {{ '@' + auth.currentUser()?.userName }}.</p>
      <button type="button" class="button button-secondary" (click)="auth.logout()">Log out</button>
    </main>
  `,
  styles: `
    .page {
      max-width: 750px;
      margin: auto;
      padding: 54px 24px 80px;
    }
  `,
})
export class Feed {
  protected readonly auth = inject(AuthService);
}
