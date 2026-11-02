import { Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post } from '../../../core/models/post.models';
import { PostActionsDialog } from '../../../core/services/post-actions-dialog.service';
import { PostService } from '../../../core/services/post.service';
import { getApiErrorMessage } from '../../../core/utils/api-error';
import { toApiUrl } from '../../../core/utils/api-url';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../shared/toast/toast.service';

const PREVIEW_LENGTH = 40;

@Component({
  selector: 'app-delete-post-dialog',
  imports: [ConfirmDialog],
  templateUrl: './delete-post-dialog.html',
  styleUrl: './delete-post-dialog.scss',
})
export class DeletePostDialog {
  private readonly postService = inject(PostService);
  private readonly dialog = inject(PostActionsDialog);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly post = input.required<Post>();

  protected readonly imageUrl = computed(() => toApiUrl(this.post().postImagePath));
  protected readonly captionPreview = computed(() => {
    const caption = this.post().caption;
    if (!caption) {
      return 'Post without a caption';
    }
    return `“${caption.length > PREVIEW_LENGTH ? caption.slice(0, PREVIEW_LENGTH).trimEnd() + '…' : caption}”`;
  });
  protected readonly deleting = signal(false);
  protected readonly error = signal('');

  protected close(): void {
    this.dialog.close();
  }

  protected confirm(): void {
    if (this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.error.set('');

    this.postService
      .deletePost(this.post().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show('Post deleted.');
          this.dialog.close();
        },
        error: (err) => {
          this.error.set(getApiErrorMessage(err, "Couldn't delete this post. Please try again."));
          this.deleting.set(false);
        },
      });
  }
}
