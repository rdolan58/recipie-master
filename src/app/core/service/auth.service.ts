import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private readonly tokenEndpoint = `${environment.apiUrl}/token/`;

  constructor(private http: HttpClient) {
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

    return this.http.post<any>(this.tokenEndpoint, body, { headers }).pipe(
      map((response) => {
        const user: User = {
          id: response.id,
          username: response.username,
          first_name: response.first_name,
          last_name: response.last_name,
          email: response.email,
          roles: response.roles, // Assign roles from response
          permissions: response.permissions, // Assign permissions from response
          token: response.access, // Store access token
          is_superuser: false, // Update if returned by API
          is_staff: false, // Update if returned by API
          is_active: true, // Update if returned by API
          date_joined: '', // Update if returned by API
          last_login: '', // Update if returned by API
        };

        // Save user to local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('access_token', response.access); // Save token

        this.currentUserSubject.next(user);
        return user;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError('Username or password is incorrect');
      })
    );
  }

  logout() {
    // Remove user and token from local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
    this.currentUserSubject.next({} as User); // Reset the current user
    return of({ success: false });
  }
}

// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
// import { User } from '../models/user';
// import { catchError, map } from 'rxjs/operators';
// import { environment } from '../../../environments/environment';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUserSubject: BehaviorSubject<User>;
//   public currentUser: Observable<User>;
//   private readonly tokenEndpoint = `${environment.apiUrl}/token/`;

//   constructor(private http: HttpClient) {
//     this.currentUserSubject = new BehaviorSubject<User>(
//       JSON.parse(localStorage.getItem('currentUser') || '{}')
//     );
//     this.currentUser = this.currentUserSubject.asObservable();
//   }

//   public get currentUserValue(): User {
//     return this.currentUserSubject.value;
//   }

//   login(username: string, password: string): Observable<User> {
//     const body = { username, password };
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

//     return this.http.post<{ access: string }>(this.tokenEndpoint, body, { headers }).pipe(
//       map((response) => {
//         const user: User = {
//           id: 1, // This can be replaced with actual user data if available from the API
//           username: username,
//           first_name: 'FirstName', // Placeholder; replace with actual data if available
//           last_name: 'LastName', // Placeholder; replace with actual data if available
//           password: '',
//           token: response.access,
//           //img: '',
//           is_superuser: false,
//           is_staff: false,
//           is_active: false, 
//           date_joined: ""
//         };
//         localStorage.setItem('currentUser', JSON.stringify(user));
//         localStorage.setItem('access_token', response.access); // Store access token
//         this.currentUserSubject.next(user);
//         return user;
//       }),
//       catchError((error) => {
//         console.error('Login failed:', error);
//         return throwError('Username or password is incorrect');
//       })
//     );
//   }

//   logout() {
//     // remove user from local storage to log user out
//     localStorage.removeItem('currentUser');
//     localStorage.removeItem('access_token'); // Remove access token
//     this.currentUserSubject.next(this.currentUserValue);
//     return of({ success: false });
//   }
// }

// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
// import { User } from '../models/user';
// import { HttpResponse } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthService {
//   private currentUserSubject: BehaviorSubject<User>;
//   public currentUser: Observable<User>;

//   private users = [
//     {
//       id: 1,
//       userName: 'admin@email.com',
//       password: 'admin@123',
//       firstName: 'Ray',
//       lastName: 'Dolan',
//       token: 'admin-token',
//       img: '',
//     },
//   ];

//   constructor() {
//     this.currentUserSubject = new BehaviorSubject<User>(
//       JSON.parse(localStorage.getItem('currentUser') || '{}')
//     );
//     this.currentUser = this.currentUserSubject.asObservable();
//   }

//   public get currentUserValue(): User {
//     return this.currentUserSubject.value;
//   }

//   login(userName: string, password: string) {

//     const user = this.users.find((u) => u.userName === userName && u.password === password);

//     if (!user) {
//       return this.error('Username or password is incorrect');
//     } else {
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       this.currentUserSubject.next(user);
//       return this.ok({
//         id: user.id,
//         userName: user.userName,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         token: user.token,
//         img: user.img,
//       });
//     }


//   }
//   ok(body?: {
//     id: number;
//     userName: string;
//     firstName: string;
//     lastName: string;
//     token: string;
//     img: string;
//   }) {
//     return of(new HttpResponse({ status: 200, body }));
//   }
//   error(message: string) {
//     return throwError(message);
//   }

//   logout() {
//     // remove user from local storage to log user out
//     localStorage.removeItem('currentUser');
//     this.currentUserSubject.next(this.currentUserValue);
//     return of({ success: false });
//   }
// }
