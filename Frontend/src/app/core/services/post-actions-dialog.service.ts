import { Injectable, signal } from '@angular/core';
import { Post } from '../models/post.models';

// Which post the shell's Edit Post modal or Delete Post dialog is open for.
// The menu lives on feed cards and the details page, so the dialogs live in the shell.
@Injectable({ providedIn: 'root' })
export class PostActionsDialog {
  private readonly edit = signal<Post | null>(null);
  private readonly remove = signal<Post | null>(null);
  readonly editing = this.edit.asReadonly();
  readonly deleting = this.remove.asReadonly();

  openEdit(post: Post): void {
    this.edit.set(post);
  }

  openDelete(post: Post): void {
    this.remove.set(post);
  }

  close(): void {
    this.edit.set(null);
    this.remove.set(null);
  }
}
