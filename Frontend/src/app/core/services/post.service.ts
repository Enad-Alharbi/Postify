import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAX_PAGE_SIZE, PaginatedResponse } from '../models/pagination.models';
import { CreatePostResponse, Post } from '../models/post.models';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/Posts`;

  private readonly createdPosts = new Subject<Post>();
  // Lets any page (feed, profile) add a post created from the shell's modal.
  readonly postCreated$ = this.createdPosts.asObservable();

  getPosts(pageNumber: number, pageSize = MAX_PAGE_SIZE): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Post>>(this.apiUrl, { params });
  }

  createPost(image: File, caption: string): Observable<Post> {
    // Field names must match CreatePostDto. The browser sets the multipart Content-Type itself.
    const body = new FormData();
    body.append('PostImage', image);
    if (caption) {
      body.append('Caption', caption);
    }

    return this.http.post<CreatePostResponse>(this.apiUrl, body).pipe(
      map((response) => response.post!),
      tap((post) => this.createdPosts.next(post)),
    );
  }
}
