import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private readonly tokenEndpoint = `${environment.apiUrl}/token/`;
  private access_token = "";

  constructor(private http: HttpClient) {
    localStorage.removeItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User>(

      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    console.log('Login method: Sending login request to', this.tokenEndpoint);
    console.log('Login method: Request body', body);

    return this.http.post<any>(this.tokenEndpoint, body, { headers }).pipe(
      map((response) => {
        console.log('Login method: Received successful response', response);
        const user: User = {
          id: response.id,
          username: response.username,
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          roles: response.roles, // Assign roles from response
          permissions: response.permissions, // Assign permissions from response
          token: response.access, // Store access token
          is_superuser: response.is_superuser, // Update if returned by API
          is_staff: response.is_staff, // Update if returned by API
          is_active: response.is_active, // Update if returned by API
          date_joined: response.date_joined, // Update if returned by API
          last_login: response.last_login, // Update if returned by API
          profile_image: response.profile_image,// Update if returned by API
          profile_image_url: response.profile_image_url, // Update if returned by API
          social_media_links: response.social_media_links,
          phone: response.phone,
          bio: response.bio,
        };

        console.log('Login method: Mapped user object', user);

        //Save user to local storage
        this.access_token = response.access;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('access_token', response.access); // Save token
        this.currentUserSubject.next(user);
        return user;
      }),

      catchError((error) => {
        console.error('Full error object:', error); // Log the full error object for debugging

        // let errorMessage = 'An error occurred.';
        // if (error instanceof HttpErrorResponse) {
        //   console.error('Error status:', error.status); // Log the status if available
        //   if (error.status === 401) {
        //     errorMessage = 'Invalid username or password.';
        //   } else if (error.status === 0) {
        //     errorMessage = 'Network error. Please check your connection.';
        //   } else if (error.error && error.error.detail) {
        //     errorMessage = error.error.detail; // Custom error message from API
        //   }
        // } else {
        //   console.error('Unexpected error:', error); // Handle non-HttpErrorResponse errors
        //   errorMessage = error.message || 'An unexpected error occurred.';
        // }
        // console.log('Login method: Returning error message to component', error);
        return throwError(() => new Error(error));
      })
    );
  }



  updateUserFields<T extends object>(source: T, changes: Partial<T>): T {
    for (const key of Object.keys(source) as (keyof T)[]) {
      if (key in changes && changes[key] !== undefined) {
        source[key] = changes[key]!;
      }
    }
    return source;
  }

  updateCurrentUser(newUser: User): User {
    //return User;
    const updatedUser = this.updateUserFields(this.currentUserValue, newUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    //this.currentUserSubject.next(updatedUser);
    return updatedUser;
  }

  logout() {
    // Remove user and token from local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    this.currentUserSubject.next({} as User); // Reset the current user
    return of({ success: false });
  }
}

