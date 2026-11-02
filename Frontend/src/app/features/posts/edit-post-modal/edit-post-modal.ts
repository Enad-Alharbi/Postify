import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CAPTION_MAX_LENGTH, Post } from '../../../core/models/post.models';
import { PostActionsDialog } from '../../../core/services/post-actions-dialog.service';
import { PostService } from '../../../core/services/post.service';
import { getApiErrorMessage } from '../../../core/utils/api-error';
import { toApiUrl } from '../../../core/utils/api-url';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-edit-post-modal',
  imports: [Icon, Modal],
  templateUrl: './edit-post-modal.html',
  styleUrl: './edit-post-modal.scss',
})
export class EditPostModal implements OnInit {
  private readonly postService = inject(PostService);
  private readonly dialog = inject(PostActionsDialog);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly post = input.required<Post>();

  protected readonly maxLength = CAPTION_MAX_LENGTH;
  protected readonly imageUrl = computed(() => toApiUrl(this.post().postImagePath));
  protected readonly caption = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  // The caption is optional, so an empty one is a valid change.
  protected readonly canSave = computed(() => this.caption().trim() !== (this.post().caption ?? '') && !this.saving());

  ngOnInit(): void {
    this.caption.set(this.post().caption ?? '');
  }

  protected onInput(event: Event): void {
    this.caption.set((event.target as HTMLTextAreaElement).value.slice(0, CAPTION_MAX_LENGTH));
  }

  protected close(): void {
    this.dialog.close();
  }

  protected save(): void {
    if (!this.canSave()) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.postService
      .updateCaption(this.post().id, this.caption().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show('Post caption updated.');
          this.dialog.close();
        },
        error: (err) => {
          this.error.set(getApiErrorMessage(err, "Couldn't save your changes. Please try again."));
          this.saving.set(false);
        },
      });
  }
}
