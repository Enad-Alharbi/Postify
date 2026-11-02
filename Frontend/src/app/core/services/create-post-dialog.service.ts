import { Injectable, signal } from '@angular/core';

// Open state for the Create Post modal, which lives in the shell so the feed,
// the mobile nav and (later) the profile page can all open it.
@Injectable({ providedIn: 'root' })
export class CreatePostDialog {
  private readonly open = signal(false);
  readonly isOpen = this.open.asReadonly();

  show(): void {
    this.open.set(true);
  }

  hide(): void {
    this.open.set(false);
  }
}
