import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAX_PAGE_SIZE, PaginatedResponse } from '../models/pagination.models';
import { Post } from '../models/post.models';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/Posts`;

  getPosts(pageNumber: number, pageSize = MAX_PAGE_SIZE): Observable<PaginatedResponse<Post>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.http.get<PaginatedResponse<Post>>(this.apiUrl, { params });
  }
}
