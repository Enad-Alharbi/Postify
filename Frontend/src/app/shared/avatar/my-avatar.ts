import { Component, computed, inject, input } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { Avatar } from './avatar';

// The signed-in user's avatar. Uses /Profiles/me for the picture (and names, so edits show up),
// falling back to /Users/me while the profile loads.
@Component({
  selector: 'app-my-avatar',
  imports: [Avatar],
  template: `
    @if (person(); as p) {
      <app-avatar [firstName]="p.firstName" [lastName]="p.lastName" [userId]="p.userId" [picturePath]="p.picturePath" [size]="size()" />
    }
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class MyAvatar {
  private readonly auth = inject(AuthService);
  private readonly profiles = inject(ProfileService);

  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  protected readonly person = computed(() => {
    const profile = this.profiles.myProfile();
    if (profile) {
      return { ...profile, picturePath: profile.profilePicturePath };
    }

    const user = this.auth.currentUser();
    return user ? { firstName: user.firstName, lastName: user.lastName, userId: user.id, picturePath: null } : null;
  });
}
