import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Post } from '../../core/models/post.models';
import { AuthService } from '../../core/services/auth.service';
import { CreatePostDialog } from '../../core/services/create-post-dialog.service';
import { PostService } from '../../core/services/post.service';
import { PagedList } from '../../core/utils/paged-list';
import { MyAvatar } from '../../shared/avatar/my-avatar';
import { Icon } from '../../shared/icon/icon';
import { PostCard } from './post-card/post-card';

@Component({
  selector: 'app-feed',
  imports: [Icon, MyAvatar, PostCard],
  templateUrl: './feed.html',
  styleUrl: './feed.scss',
})
export class Feed implements OnInit {
  private readonly postService = inject(PostService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);
  protected readonly createPost = inject(CreatePostDialog);

  protected readonly posts = new PagedList<Post>(
    (pageNumber) => this.postService.getPosts(pageNumber),
    this.destroyRef,
    "Couldn't load posts. Please try again.",
  );
  protected readonly greeting = getGreeting();

  ngOnInit(): void {
    this.posts.loadMore();

    // Changes made from the shell's post modals show up without a reload.
    this.postService.postCreated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((created) => this.posts.prepend(created));
    this.postService.postUpdated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((updated) => this.posts.replace(updated));
    this.postService.postDeleted$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((deletedId) => this.posts.remove(deletedId));
  }
}

function getGreeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  return hour < 18 ? 'Good afternoon' : 'Good evening';
}
