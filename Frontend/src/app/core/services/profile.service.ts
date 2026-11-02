import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UpdateProfileRequest, UpdateProfileResponse, UserProfile } from '../models/profile.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
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

  updateMyProfile(request: UpdateProfileRequest): Observable<UserProfile> {
    // Field names must match UpdateProfileDto. Bio is always sent, because omitting it clears it.
    const body = new FormData();
    body.append('FirstName', request.firstName);
    body.append('LastName', request.lastName);
    body.append('Bio', request.bio);
    if (request.profilePicture) {
      body.append('ProfilePicture', request.profilePicture);
    }

    return this.http.put<UpdateProfileResponse>(`${this.apiUrl}/me`, body).pipe(
      map((response) => response.updatedProfile!),
      tap((profile) => {
        this.mine.set(profile);
        this.auth.updateCurrentUserNames(profile.firstName, profile.lastName);
      }),
    );
  }

  // Called by the shell whenever a signed-in session starts.
  loadMyProfile(): void {
    this.mine.set(null);
    this.getMyProfile().subscribe({ error: () => this.mine.set(null) });
  }
}
