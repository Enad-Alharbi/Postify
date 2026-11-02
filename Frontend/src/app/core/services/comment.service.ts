import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comment, CreateCommentResponse } from '../models/comment.models';
import { MAX_PAGE_SIZE, PaginatedResponse } from '../models/pagination.models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api`;

  getComments(postId: string, pageNumber: number, pageSize = MAX_PAGE_SIZE): Observable<PaginatedResponse<Comment>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Comment>>(`${this.apiUrl}/Posts/${postId}/Comments`, { params });
  }

  createComment(postId: string, content: string): Observable<Comment> {
    return this.http
      .post<CreateCommentResponse>(`${this.apiUrl}/Posts/${postId}/Comments`, { content })
      .pipe(map((response) => response.comment!));
  }
}
