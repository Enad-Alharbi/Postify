import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/profile.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/Profiles`;

  // The signed-in user's profile. /Users/me has no picture, so avatars of "me" read it from here.
  private readonly mine = signal<UserProfile | null>(null);
  readonly myProfile = this.mine.asReadonly();

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(tap((profile) => this.mine.set(profile)));
  }

  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  // Called by the shell whenever a signed-in session starts.
  loadMyProfile(): void {
    this.mine.set(null);
    this.getMyProfile().subscribe({ error: () => this.mine.set(null) });
  }
}
