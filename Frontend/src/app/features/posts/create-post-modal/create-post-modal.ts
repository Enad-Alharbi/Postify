import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnDestroy, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CAPTION_MAX_LENGTH,
  POST_IMAGE_EXTENSIONS,
  POST_IMAGE_MAX_BYTES,
  POST_IMAGE_TYPES,
} from '../../../core/models/post.models';
import { AuthService } from '../../../core/services/auth.service';
import { CreatePostDialog } from '../../../core/services/create-post-dialog.service';
import { PostService } from '../../../core/services/post.service';
import { getApiErrorMessage } from '../../../core/utils/api-error';
import { Avatar } from '../../../shared/avatar/avatar';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-create-post-modal',
  imports: [Avatar, Icon, Modal],
  templateUrl: './create-post-modal.html',
  styleUrl: './create-post-modal.scss',
})
export class CreatePostModal implements OnDestroy {
  private readonly postService = inject(PostService);
  private readonly dialog = inject(CreatePostDialog);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  protected readonly captionMaxLength = CAPTION_MAX_LENGTH;
  protected readonly acceptedTypes = POST_IMAGE_TYPES.join(',');

  protected readonly image = signal<File | null>(null);
  protected readonly previewUrl = signal<string | null>(null);
  protected readonly caption = signal('');
  protected readonly dragging = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  ngOnDestroy(): void {
    this.revokePreview();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Reset so selecting the same file again still fires a change event.
    input.value = '';

    if (file) {
      this.selectImage(file);
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);

    const file = event.dataTransfer?.files[0];
    if (file) {
      this.selectImage(file);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onCaptionInput(event: Event): void {
    this.caption.set((event.target as HTMLTextAreaElement).value);
  }

  protected removeImage(): void {
    this.revokePreview();
    this.image.set(null);
  }

  protected close(): void {
    this.dialog.hide();
  }

  protected publish(): void {
    const image = this.image();
    if (!image || this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.postService
      .createPost(image, this.caption().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toast.show('Your post is now live.');
          this.dialog.hide();
        },
        error: (err) => {
          this.error.set(
            err instanceof HttpErrorResponse && err.status === 413
              ? 'This image is too large for the server. Try a smaller file.'
              : getApiErrorMessage(err, "Couldn't publish your post. Please try again."),
          );
          this.loading.set(false);
        },
      });
  }

  private selectImage(file: File): void {
    const validationError = validateImage(file);
    this.error.set(validationError);

    if (validationError) {
      return;
    }

    this.revokePreview();
    this.image.set(file);
    this.previewUrl.set(URL.createObjectURL(file));
  }

  private revokePreview(): void {
    const url = this.previewUrl();
    if (url) {
      URL.revokeObjectURL(url);
      this.previewUrl.set(null);
    }
  }
}

function validateImage(file: File): string {
  const extension = file.name.slice(file.name.lastIndexOf('.'));

  if (!POST_IMAGE_EXTENSIONS.includes(extension) || !POST_IMAGE_TYPES.includes(file.type)) {
    return 'Choose a .jpg, .jpeg or .png image (lowercase extension).';
  }
  if (file.size === 0) {
    return 'That file is empty. Choose another image.';
  }
  if (file.size > POST_IMAGE_MAX_BYTES) {
    return 'Images must be 50MB or less.';
  }

  return '';
}
