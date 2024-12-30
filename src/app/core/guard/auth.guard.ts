import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Define routes that don't require authentication
    const allowedUnauthenticatedRoutes = [
      '/authentication/signin',
      '/authentication/signup',
      '/authentication/forgot',
      '/authentication/reset',
    ];

    // Get the current route's URL (excluding query parameters)
    const requestedRoute = state.url.split('?')[0];

    // Allow access to unauthenticated routes
    if (allowedUnauthenticatedRoutes.some(route => requestedRoute.startsWith(route))) {
      return true;
    }

    // Allow access if user is authenticated
    if (this.authService.currentUserValue) {
      return true;
    }

    // Redirect to signin if not authenticated
    this.router.navigate(['/authentication/signin']);
    return false;
  }
}
// // import { Injectable } from '@angular/core';
// // import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// // import { AuthService } from '../service/auth.service';

// // @Injectable({
// //   providedIn: 'root',
// // })
// // export class AuthGuard  {
// //   constructor(private authService: AuthService, private router: Router) {}

// //   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
// //     if (this.authService.currentUserValue) {
// //       return true;
// //     }
// //     this.router.navigate(['/authentication/signin']);
// //     return false;
// //   }
// // }
// import { Injectable } from '@angular/core';
// import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AuthService } from '../service/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     const publicRoutes = ['/authentication/signin', '/authentication/signup', '/authentication/forgot', '/authentication/reset']; // Add public routes here

//     if (publicRoutes.some((url) => state.url.startsWith(url))) {
//       // Allow access to public routes
//       return true;
//     }

//     if (this.authService.currentUserValue) {
//       // User is authenticated
//       return true;
//     }

//     // Redirect to signin for private routes
//     this.router.navigate(['/authentication/signin']);
//     return false;
//   }
// }
