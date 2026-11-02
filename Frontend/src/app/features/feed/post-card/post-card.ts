import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.models';
import { AuthService } from '../../../core/services/auth.service';
import { PostActionsDialog } from '../../../core/services/post-actions-dialog.service';
import { toApiUrl } from '../../../core/utils/api-url';
import { ActionMenu, ActionMenuItem } from '../../../shared/action-menu/action-menu';
import { Avatar } from '../../../shared/avatar/avatar';
import { Icon } from '../../../shared/icon/icon';
import { TimeAgoPipe } from '../../../shared/time-ago/time-ago.pipe';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, ActionMenu, Avatar, Icon, TimeAgoPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  private readonly auth = inject(AuthService);
  private readonly postActions = inject(PostActionsDialog);

  readonly post = input.required<Post>();

  protected readonly actions: ActionMenuItem[] = [
    { id: 'edit', label: 'Edit caption', icon: 'edit' },
    { id: 'delete', label: 'Delete post', icon: 'trash', danger: true },
  ];
  protected readonly imageUrl = computed(() => toApiUrl(this.post().postImagePath));
  protected readonly detailsLink = computed(() => ['/posts', this.post().id]);
  protected readonly authorLink = computed(() => ['/users', this.post().userId]);
  // Only the author sees the menu; the backend still enforces ownership with 403.
  protected readonly isOwn = computed(() => this.post().userId === this.auth.currentUser()?.id);

  protected onAction(action: string): void {
    if (action === 'edit') {
      this.postActions.openEdit(this.post());
    } else if (action === 'delete') {
      this.postActions.openDelete(this.post());
    }
  }
}
