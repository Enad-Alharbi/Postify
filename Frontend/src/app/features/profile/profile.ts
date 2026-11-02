import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Post } from '../../core/models/post.models';
import { UserProfile } from '../../core/models/profile.models';
import { AuthService } from '../../core/services/auth.service';
import { PostService } from '../../core/services/post.service';
import { ProfileService } from '../../core/services/profile.service';
import { getApiErrorMessage } from '../../core/utils/api-error';
import { toApiUrl } from '../../core/utils/api-url';
import { PagedList } from '../../core/utils/paged-list';
import { Avatar } from '../../shared/avatar/avatar';
import { Icon } from '../../shared/icon/icon';

// One page for both "/profile" (me) and "/users/:userId" (someone else).
@Component({
  selector: 'app-profile',
  imports: [RouterLink, Avatar, Icon],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly profiles = inject(ProfileService);
  private readonly postService = inject(PostService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Bound from the :userId route param; undefined on /profile.
  readonly userId = input<string>();

  protected readonly isMine = computed(() => !this.userId());
  protected readonly profile = signal<UserProfile | null>(null);
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly error = signal('');

  protected readonly posts = new PagedList<Post>(
    (pageNumber) => {
      const userId = this.userId();
      return userId ? this.postService.getUserPosts(userId, pageNumber) : this.postService.getMyPosts(pageNumber);
    },
    this.destroyRef,
    "Couldn't load posts. Please try again.",
  );

  ngOnInit(): void {
    // Viewing your own id under /users/... shows the "My profile" version instead.
    if (this.userId() && this.userId() === this.auth.currentUser()?.id) {
      this.router.navigate(['/profile'], { replaceUrl: true });
      return;
    }

    this.loadProfile();
    this.posts.loadMore();

    if (this.isMine()) {
      this.postService.postCreated$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((created) => this.posts.prepend(created));
    }
  }

  protected loadProfile(): void {
    const userId = this.userId();
    const request = userId ? this.profiles.getProfile(userId) : this.profiles.getMyProfile();

    this.loading.set(true);
    this.error.set('');

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: (err) => {
        // 400 means the id in the URL isn't a valid GUID.
        const missing = err instanceof HttpErrorResponse && (err.status === 404 || err.status === 400);
        this.notFound.set(missing);
        this.error.set(missing ? '' : getApiErrorMessage(err, "Couldn't load this profile. Please try again."));
        this.loading.set(false);
      },
    });
  }

  protected imageUrl(post: Post): string {
    return toApiUrl(post.postImagePath);
  }
}
