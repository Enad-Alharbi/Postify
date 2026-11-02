import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';

// Wraps every signed-in page with the navbar.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar],
  template: `
    <app-navbar />
    <router-outlet />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }

    /* Leaves room for the fixed mobile bottom nav. */
    @media (max-width: 600px) {
      :host {
        padding-bottom: 67px;
      }
    }
  `,
})
export class Shell {}
