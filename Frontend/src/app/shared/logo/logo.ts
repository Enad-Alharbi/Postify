import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  imports: [RouterLink],
  template: `
    <a class="logo" routerLink="/" aria-label="Postify home">
      <span class="logo-mark"><span></span></span>
      <span>postify</span>
    </a>
  `,
  styleUrl: './logo.scss',
})
export class Logo {}
