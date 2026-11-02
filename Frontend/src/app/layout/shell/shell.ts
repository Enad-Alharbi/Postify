import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreatePostDialog } from '../../core/services/create-post-dialog.service';
import { ProfileService } from '../../core/services/profile.service';
import { CreatePostModal } from '../../features/posts/create-post-modal/create-post-modal';
import { Toast } from '../../shared/toast/toast';
import { Navbar } from '../navbar/navbar';

// Wraps every signed-in page with the navbar, plus the app-wide Create Post modal and toast.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, Navbar, CreatePostModal, Toast],
  template: `
    <app-navbar />
    <router-outlet />

    @if (createPost.isOpen()) {
      <app-create-post-modal />
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
export class Shell implements OnInit {
  private readonly profiles = inject(ProfileService);
  protected readonly createPost = inject(CreatePostDialog);

  // The shell exists only while signed in, so this runs after login and on every refresh.
  ngOnInit(): void {
    this.profiles.loadMyProfile();
  }
}
