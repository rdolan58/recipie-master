import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users/'; // Replace with the actual API URL

  constructor(private http: HttpClient) {}

  // Get all users
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Search users by first name and/or last name
  searchUsers(searchTerm: string): Observable<User[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  // Get a specific user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}${id}/`);
  }

  // Create a new user
  createUser(userData: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  // // Update an existing user
  // updateUser(userData: Partial<User>): Observable<User> {
  //   const id = userData.id
  //   return this.http.put<User>(`${this.apiUrl}${id}/`, userData);
  // }

  // Delete a user
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }


   // Update user profile with multipart form data
   updateUser(userData: Partial<User>, profileImage?: File): Observable<any> {
    const formData = new FormData();
    const id = userData.id;
    
    // Append JSON data as a string in the 'data' form field
    formData.append('data', JSON.stringify(userData));

    // Append the profile image if provided
    if (profileImage) {
      formData.append('profile_image', profileImage);
    }

    // Set headers for multipart/form-data
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.patch<User>(`${this.apiUrl}${id}/`, formData, { headers });
    
  }

    // Add to UserService
  patchUser(userData: Partial<User>, profileImage?: File): Observable<any> {
    const formData = new FormData();
    const id = userData.id;
    
    // Append JSON data as a string in the 'data' form field
    formData.append('data', JSON.stringify(userData));

    // Append the profile image if provided
    if (profileImage) {
      formData.append('image', profileImage);
    }

    // Set headers for multipart/form-data
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    //return this.http.patch<User>(`${this.apiUrl}${id}/`, formData, { headers });

    return this.http.patch<User>(`${this.apiUrl}${id}/`, formData, { headers }).pipe(
      catchError((error) => {
        // Log the error for debugging
        console.error('Error during PATCH request:', error);
  
        // Re-throw a processed error message
        return throwError(() => new Error(error?.error?.message || 'An unexpected error occurred.'));
      })
    );

  }

}
