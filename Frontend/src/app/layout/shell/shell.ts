import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CreatePostDialog } from '../../core/services/create-post-dialog.service';
import { PostActionsDialog } from '../../core/services/post-actions-dialog.service';
import { ProfileService } from '../../core/services/profile.service';
import { CreatePostModal } from '../../features/posts/create-post-modal/create-post-modal';
import { DeletePostDialog } from '../../features/posts/delete-post-dialog/delete-post-dialog';
import { EditPostModal } from '../../features/posts/edit-post-modal/edit-post-modal';
import { Toast } from '../../shared/toast/toast';
import { Navbar } from '../navbar/navbar';

// Wraps every signed-in page with the navbar, plus the app-wide post modals and toast.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar, CreatePostModal, DeletePostDialog, EditPostModal, Toast],
  template: `
    <app-navbar />
    <router-outlet />

    @if (createPost.isOpen()) {
      <app-create-post-modal />
    }
    @if (postActions.editing(); as post) {
      <app-edit-post-modal [post]="post" />
    }
    @if (postActions.deleting(); as post) {
      <app-delete-post-dialog [post]="post" />
    }
    <app-toast />
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
    }

    /* Leaves room for the fixed mobile bottom nav. */
    @media (max-width: 600px) {
      :host {
        padding-bottom: 67px;
      }
    }
  `,
})
export class Shell implements OnInit, OnDestroy {
  private readonly profiles = inject(ProfileService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly createPost = inject(CreatePostDialog);
  protected readonly postActions = inject(PostActionsDialog);

  // The shell exists only while signed in, so this runs after login and on every refresh.
  ngOnInit(): void {
    this.profiles.loadMyProfile();

    // Don't leave a modal open over a different page (for example after browser Back).
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeDialogs());
  }

  // The dialog state lives in root services, so clear it on logout or it would reopen after the next login.
  ngOnDestroy(): void {
    this.closeDialogs();
  }

  private closeDialogs(): void {
    this.createPost.hide();
    this.postActions.close();
  }
}
