// import { Injectable } from '@angular/core';
// import {
//   CanActivate,
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   UrlTree,
//   Router,
//   UrlSegment,
// } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router, private authService: AuthService) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ):
//     | Observable<boolean | UrlTree>
//     | Promise<boolean | UrlTree>
//     | boolean
//     | UrlTree {
//     // ... (your existing authentication logic)

//     if (
//       this.authService.isLoggedIn() &&
//       (route.url.includes(new UrlSegment('login', {})) ||
//         route.url.includes(new UrlSegment('join', {})))
//     ) {
//       this.router.navigate(['/home']);
//       return false; // Prevent access to login/join for logged-in users
//     }
  
//     return true; // Allow navigation if all conditions are met
//   }
// }

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // If the user is logged in and trying to access login or join page, redirect to home
    if (this.authService.isLoggedIn() && (state.url.includes('/login') || state.url.includes('/join'))) {
      this.router.navigate(['/home']);
      return false;
    }
    
    // If the user is not logged in and trying to access protected routes, redirect to login
    if (!this.authService.isLoggedIn() && !state.url.includes('/login') && !state.url.includes('/join')) {
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}
