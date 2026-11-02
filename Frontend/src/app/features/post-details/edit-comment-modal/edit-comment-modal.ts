import { Component, DestroyRef, OnInit, computed, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { COMMENT_MAX_LENGTH, Comment } from '../../../core/models/comment.models';
import { CommentService } from '../../../core/services/comment.service';
import { getApiErrorMessage } from '../../../core/utils/api-error';
import { Icon } from '../../../shared/icon/icon';
import { Modal } from '../../../shared/modal/modal';

@Component({
  selector: 'app-edit-comment-modal',
  imports: [Icon, Modal],
  templateUrl: './edit-comment-modal.html',
})
export class EditCommentModal implements OnInit {
  private readonly commentService = inject(CommentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly comment = input.required<Comment>();
  readonly saved = output<Comment>();
  readonly closed = output<void>();

  protected readonly maxLength = COMMENT_MAX_LENGTH;
  protected readonly text = signal('');
  protected readonly saving = signal(false);
  protected readonly error = signal('');
  protected readonly canSave = computed(() => {
    const trimmed = this.text().trim();
    return trimmed.length > 0 && trimmed !== this.comment().content && !this.saving();
  });

  ngOnInit(): void {
    this.text.set(this.comment().content);
  }

  protected onInput(event: Event): void {
    this.text.set((event.target as HTMLTextAreaElement).value.slice(0, COMMENT_MAX_LENGTH));
  }

  protected save(): void {
    if (!this.canSave()) {
      return;
    }

    this.saving.set(true);
    this.error.set('');

    this.commentService
      .updateComment(this.comment().id, this.text().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (comment) => this.saved.emit(comment),
        error: (err) => {
          this.error.set(getApiErrorMessage(err, "Couldn't save your changes. Please try again."));
          this.saving.set(false);
        },
      });
  }
}
