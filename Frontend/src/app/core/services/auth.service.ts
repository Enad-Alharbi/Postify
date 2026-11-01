import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, User } from '../models/auth.models';

const TOKEN_KEY = 'postify.accessToken';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${environment.apiBaseUrl}/api`;

  private readonly user = signal<User | null>(null);
  readonly currentUser = this.user.asReadonly();

  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/Auth/register`, request);
  }

  // Login only returns the token, so the user is loaded from /Users/me right after.
  login(request: LoginRequest): Observable<User> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Auth/login`, request).pipe(
      tap((response) => localStorage.setItem(TOKEN_KEY, response.accessToken ?? '')),
      switchMap(() => this.loadCurrentUser()),
    );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/Users/me`).pipe(tap((user) => this.user.set(user)));
  }

  // Runs on app start so a page refresh keeps the user signed in.
  restoreSession(): Observable<User | null> {
    if (!this.getToken()) {
      return of(null);
    }

    return this.loadCurrentUser().pipe(catchError(() => of(null)));
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.user.set(null);
    this.router.navigate(['/login']);
  }

  // Returns null (and clears storage) when the token is missing or expired.
  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    return token;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
