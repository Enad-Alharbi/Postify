import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post } from '../../core/models/post.models';
import { AuthService } from '../../core/services/auth.service';
import { PostService } from '../../core/services/post.service';
import { getApiErrorMessage } from '../../core/utils/api-error';
import { Icon } from '../../shared/icon/icon';
import { PostCard } from './post-card/post-card';

@Component({
  selector: 'app-feed',
  imports: [Icon, PostCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit {
  private readonly postService = inject(PostService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  protected readonly posts = signal<Post[]>([]);
  protected readonly loading = signal(false);
  protected readonly loaded = signal(false);
  protected readonly hasNextPage = signal(true);
  protected readonly error = signal('');
  protected readonly greeting = getGreeting();

  private lastPage = 0;

  ngOnInit(): void {
    this.loadMore();
  }

  protected loadMore(): void {
    // Blocks duplicate requests while one is in flight.
    if (this.loading() || !this.hasNextPage()) {
      return;
    }

    this.loading.set(true);
    this.error.set('');

    this.postService
      .getPosts(this.lastPage + 1)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (page) => {
          // New posts can shift later pages, so skip anything already shown.
          const shownIds = new Set(this.posts().map((post) => post.id));
          this.posts.update((posts) => [...posts, ...page.items.filter((post) => !shownIds.has(post.id))]);
          this.lastPage = page.pageNumber;
          this.hasNextPage.set(page.hasNextPage);
          this.loaded.set(true);
          this.loading.set(false);
        },
        // Already loaded posts stay on screen; the user can retry.
        error: (err) => {
          this.error.set(getApiErrorMessage(err, "Couldn't load posts. Please try again."));
          this.loading.set(false);
        },
      });
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  return hour < 18 ? 'Good afternoon' : 'Good evening';
}
