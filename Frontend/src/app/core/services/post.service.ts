import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAX_PAGE_SIZE, PaginatedResponse } from '../models/pagination.models';
import { CreatePostResponse, Post, UpdatePostResponse } from '../models/post.models';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/Posts`;

  // Let every open page (feed, profile, details) react to changes made from the shell's modals.
  private readonly createdPosts = new Subject<Post>();
  private readonly updatedPosts = new Subject<Post>();
  private readonly deletedPostIds = new Subject<string>();
  readonly postCreated$ = this.createdPosts.asObservable();
  readonly postUpdated$ = this.updatedPosts.asObservable();
  readonly postDeleted$ = this.deletedPostIds.asObservable();

  getPosts(pageNumber: number, pageSize = MAX_PAGE_SIZE): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Post>>(this.apiUrl, { params });
  }

  getMyPosts(pageNumber: number, pageSize = MAX_PAGE_SIZE): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/me`, { params });
  }

  getUserPosts(userId: string, pageNumber: number, pageSize = MAX_PAGE_SIZE): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Post>>(`${this.apiUrl}/user/${userId}`, { params });
  }

  getPost(postId: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`);
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

  // An empty caption is sent as null, which clears it. 403 (not the owner) and 404 come back as errors.
  updateCaption(postId: string, caption: string): Observable<Post> {
    return this.http.put<UpdatePostResponse>(`${this.apiUrl}/${postId}`, { caption: caption || null }).pipe(
      map((response) => response.post!),
      tap((post) => this.updatedPosts.next(post)),
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete(`${this.apiUrl}/${postId}`).pipe(
      map(() => undefined),
      tap(() => this.deletedPostIds.next(postId)),
    );
  }
}
