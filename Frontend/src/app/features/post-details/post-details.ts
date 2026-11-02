import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { COMMENT_MAX_LENGTH, Comment } from '../../core/models/comment.models';
import { Post } from '../../core/models/post.models';
import { AuthService } from '../../core/services/auth.service';
import { CommentService } from '../../core/services/comment.service';
import { PostService } from '../../core/services/post.service';
import { getApiErrorMessage } from '../../core/utils/api-error';
import { toApiUrl } from '../../core/utils/api-url';
import { PagedList } from '../../core/utils/paged-list';
import { Avatar } from '../../shared/avatar/avatar';
import { Icon } from '../../shared/icon/icon';
import { TimeAgoPipe } from '../../shared/time-ago/time-ago.pipe';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, Avatar, Icon, TimeAgoPipe],
  templateUrl: './post-details.html',
  styleUrl: './post-details.scss',
})
export class PostDetails implements OnInit {
  private readonly postService = inject(PostService);
  private readonly commentService = inject(CommentService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  // Bound from the :postId route param.
  readonly postId = input.required<string>();

  protected readonly post = signal<Post | null>(null);
  protected readonly postLoading = signal(true);
  protected readonly postNotFound = signal(false);
  protected readonly postError = signal('');
  protected readonly imageUrl = computed(() => {
    const post = this.post();
    return post ? toApiUrl(post.postImagePath) : '';
  });

  protected readonly comments = new PagedList<Comment>(
    (pageNumber) => this.commentService.getComments(this.postId(), pageNumber),
    this.destroyRef,
    "Couldn't load comments. Please try again.",
  );

  protected readonly commentMaxLength = COMMENT_MAX_LENGTH;
  protected readonly draft = signal('');
  protected readonly sending = signal(false);
  protected readonly sendError = signal('');
  protected readonly canSend = computed(() => this.draft().trim().length > 0 && !this.sending());

  ngOnInit(): void {
    this.loadPost();
    this.comments.loadMore();
  }

  protected loadPost(): void {
    this.postLoading.set(true);
    this.postError.set('');

    this.postService
      .getPost(this.postId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (post) => {
          this.post.set(post);
          this.postLoading.set(false);
        },
        error: (err) => {
          // 400 means the id in the URL isn't a valid GUID, so treat it like a missing post.
          const missing = err instanceof HttpErrorResponse && (err.status === 404 || err.status === 400);
          this.postNotFound.set(missing);
          this.postError.set(missing ? '' : getApiErrorMessage(err, "Couldn't load this post. Please try again."));
          this.postLoading.set(false);
        },
      });
  }

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value.slice(0, COMMENT_MAX_LENGTH));
  }

  protected sendComment(): void {
    if (!this.canSend()) {
      return;
    }

    this.sending.set(true);
    this.sendError.set('');

    this.commentService
      .createComment(this.postId(), this.draft().trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (comment) => {
          this.comments.prepend(comment);
          this.draft.set('');
          this.sending.set(false);
        },
        error: (err) => {
          this.sendError.set(getApiErrorMessage(err, "Couldn't post your comment. Please try again."));
          this.sending.set(false);
        },
      });
  }
}
