import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.models';
import { toApiUrl } from '../../../core/utils/api-url';
import { Avatar } from '../../../shared/avatar/avatar';
import { Icon } from '../../../shared/icon/icon';
import { TimeAgoPipe } from '../../../shared/time-ago/time-ago.pipe';

@Component({
  selector: 'app-post-card',
  imports: [RouterLink, Avatar, Icon, TimeAgoPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss',
})
export class PostCard {
  readonly post = input.required<Post>();

  protected readonly imageUrl = computed(() => toApiUrl(this.post().postImagePath));
  protected readonly detailsLink = computed(() => ['/posts', this.post().id]);
  protected readonly authorLink = computed(() => ['/users', this.post().userId]);
}
