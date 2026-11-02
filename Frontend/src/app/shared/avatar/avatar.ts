import { Component, computed, input } from '@angular/core';
import { toApiUrl } from '../../core/utils/api-url';

const TONES = ['violet', 'teal', 'coral'] as const;

// Shows the profile picture, or initials on a gradient picked from the user id.
@Component({
  selector: 'app-avatar',
  template: `
    @if (pictureUrl(); as url) {
      <img [src]="url" alt="" />
    } @else {
      {{ initials() }}
    }
  `,
  styleUrl: './avatar.scss',
  host: {
    '[class]': "'avatar avatar-' + size() + ' avatar-' + tone()",
    role: 'img',
    '[attr.aria-label]': 'firstName() + " " + lastName()',
  },
})
export class Avatar {
  readonly firstName = input.required<string>();
  readonly lastName = input.required<string>();
  readonly userId = input.required<string>();
  readonly picturePath = input<string | null>(null);
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  protected readonly pictureUrl = computed(() => {
    const path = this.picturePath();
    return path ? toApiUrl(path) : null;
  });

  protected readonly initials = computed(
    () => `${this.firstName().charAt(0)}${this.lastName().charAt(0)}`.toUpperCase(),
  );

  protected readonly tone = computed(() => {
    const sum = [...this.userId()].reduce((total, char) => total + char.charCodeAt(0), 0);
    return TONES[sum % TONES.length];
  });
}
