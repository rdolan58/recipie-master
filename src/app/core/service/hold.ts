// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenEndpoint = 'http://localhost:8000/api/token/';

  constructor(private http: HttpClient) {}

  // Method to retrieve token
  signIn(username: string, password: string): Observable<string> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<{ access: string }>(this.tokenEndpoint, body, { headers }).pipe(
      map((response) => response.access),
      catchError((error) => {
        console.error('Token retrieval failed:', error);
        return throwError(() => new Error('Invalid login credentials'));
      })
    );
  }

  // Save the access token to local storage
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // Retrieve the access token from local storage
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Log out the user by removing the token
  logout(): void {
    localStorage.removeItem('access_token');
  }
}
