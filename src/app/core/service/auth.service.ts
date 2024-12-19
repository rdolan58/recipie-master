import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

    return this.http.post<{ access: string }>(this.tokenEndpoint, body, { headers }).pipe(
      map((response) => {
        const user: User = {
          id: 1, // This can be replaced with actual user data if available from the API
          username,
          firstName: 'FirstName', // Placeholder; replace with actual data if available
          lastName: 'LastName', // Placeholder; replace with actual data if available
          password: '',
          token: response.access,
          img: '',
          is_superuser: false,
          is_staff: false,
          is_active: false, 
          date_joined: ""
        };
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('access_token', response.access); // Store access token
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
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token'); // Remove access token
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}

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
//       username: 'admin@email.com',
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

//   login(username: string, password: string) {

//     const user = this.users.find((u) => u.username === username && u.password === password);

//     if (!user) {
//       return this.error('Username or password is incorrect');
//     } else {
//       localStorage.setItem('currentUser', JSON.stringify(user));
//       this.currentUserSubject.next(user);
//       return this.ok({
//         id: user.id,
//         username: user.username,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         token: user.token,
//         img: user.img,
//       });
//     }


//   }
//   ok(body?: {
//     id: number;
//     username: string;
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
