import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JwtInterceptor: Intercepting request:', request.url);

    // Skip adding the Authorization header for reset-password requests
    if (request.url.includes('/reset-password/')) {
      return next.handle(request);
    }

    // Add Authorization header with JWT token if available
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser?.token) {
      console.log('JwtInterceptor: Adding Authorization header');
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('JwtInterceptor: Error intercepted:', error);

        // Handle specific error cases if needed
        if (error.status === 401) {
          console.warn('JwtInterceptor: Unauthorized request - possible token expiration.');
          // Optionally trigger a logout or redirect to login page
          this.authenticationService.logout();
        }

        if (error.status >= 500) {
          console.error('JwtInterceptor: Server error:', error.message);
        }

        // Re-throw the error so it can be handled by the caller
        return throwError(() => error);
      })
    );
  }
}
