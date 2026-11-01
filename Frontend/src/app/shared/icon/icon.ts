import { Component, input } from '@angular/core';

export type IconName =
  | 'home'
  | 'plus'
  | 'user'
  | 'logout'
  | 'more'
  | 'comment'
  | 'arrow'
  | 'close'
  | 'upload'
  | 'image'
  | 'edit'
  | 'trash'
  | 'check'
  | 'alert'
  | 'eye';

// Same 24x24 stroke icon set as the Figma prototype.
@Component({
  selector: 'app-icon',
  template: `
    <svg
      aria-hidden="true"
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (name()) {
        @case ('home') { <path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-6h6v6" /> }
        @case ('plus') { <path d="M12 5v14M5 12h14" /> }
        @case ('user') { <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /> }
        @case ('logout') { <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9" /> }
        @case ('more') { <circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /> }
        @case ('comment') { <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" /> }
        @case ('arrow') { <path d="m15 18-6-6 6-6" /> }
        @case ('close') { <path d="m6 6 12 12M18 6 6 18" /> }
        @case ('upload') { <path d="M12 16V4M7 9l5-5 5 5" /><path d="M4 15v5h16v-5" /> }
        @case ('image') { <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9" r="1.5" /><path d="m21 15-5-5L5 20" /> }
        @case ('edit') { <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10Z" /><path d="m14 7 3 3" /> }
        @case ('trash') { <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" /> }
        @case ('check') { <path d="m5 12 4 4L19 6" /> }
        @case ('alert') { <path d="M12 3 2.5 20h19Z" /><path d="M12 9v4M12 17h.01" /> }
        @case ('eye') { <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /> }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      flex: 0 0 auto;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}
