import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'http://localhost:8000/api/profile/'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Add a new user profile
  addUserProfile(profileData: any, profileImage?: File): Observable<any> {
    const formData = new FormData();

    // Append profile data
    for (const key in profileData) {
      if (profileData.hasOwnProperty(key)) {
        formData.append(key, profileData[key]);
      }
    }

    // Append profile image if provided
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    return this.http.post<any>(this.apiUrl, formData, {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    });
  }

  // Get user profile by ID
  getUserProfileById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`, {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    });
  }

  // Update user profile
  updateUserProfile(
    id: number,
    profileData: any,
    profileImage?: File
  ): Observable<any> {
    const formData = new FormData();

    // Append profile data
    for (const key in profileData) {
      if (profileData.hasOwnProperty(key)) {
        formData.append(key, profileData[key]);
      }
    }

    // Append profile image if provided
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    return this.http.put<any>(`${this.apiUrl}${id}/`, formData, {
      headers: new HttpHeaders({ Accept: 'application/json' }),
    });
  }
}
