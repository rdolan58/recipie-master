import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  private apiBaseUrl = 'http://127.0.0.1:8000/api'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Send password reset email
  sendResetEmail(email: string): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/password-reset/`, { email });
  }

  // Reset password using token
  resetPassword(token: string, password: string): Observable<any> {
    const fullUrl = `${this.apiBaseUrl}/reset-password/${token}/`.trim();

    const body = { 'new_password': password }; // JSON payload
    console.log(`Making POST request to URL: ${fullUrl} with body:`, body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Ensures proper content type for JSON
    });

    // Angular handles JSON serialization automatically
    return this.http.post(fullUrl, body, { headers });
  }

}