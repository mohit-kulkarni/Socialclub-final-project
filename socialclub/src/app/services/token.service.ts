// token.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'auth_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem(this.tokenKey);
    }
    return null;
  }

  setToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem(this.tokenKey, token);
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      // window.localStorage.removeItem(this.tokenKey);
      window.sessionStorage.clear();
    }
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

  setUserInfo(userData: any): void {
    if (isPlatformBrowser(this.platformId)) {
      window.sessionStorage.setItem('username', userData.username);
      window.sessionStorage.setItem('userId', userData.user);
      window.sessionStorage.setItem('profile_pic', userData.profile_pic);
      window.sessionStorage.setItem('dob', userData.dob);
      window.sessionStorage.setItem('email', userData.email);
      window.sessionStorage.setItem('fname', userData.fname);
      window.sessionStorage.setItem('lname', userData.lname);
    }
  }

  getUsername(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem('username');
    }
    return null;
  }

  getUserImg(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return window.sessionStorage.getItem('profile_pic');
    }
    return null;
  }
}
