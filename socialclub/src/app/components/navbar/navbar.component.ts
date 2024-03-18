import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  logoSource: string = '../../assets/logo/text.png';
  logoSourceMedium: string = '../../assets/logo/img.png';
  userImageSource: string = `http://localhost:8000/${sessionStorage.getItem(
    'profile_pic'
  )}`; // Replace with the actual default image path

  selectedItem: any;
  items: any[] = []; // Initialize the property

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.items = [
      { label: 'View Profile', routerLink: '/profile' },
      { label: 'Logout', routerLink: '/login' },
    ];
  }

  isDropdownVisible: boolean = false;

  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  ////////////// SEARCH COMPONENT ////////////////

  showSearchComponent = false; // Initially hidden

  showSearch() {
    this.showSearchComponent = !this.showSearchComponent;
  }

  isActive(routeLink: string) {
    const currentUrl = this.router.url;
    // Remove query params and trailing slash for accurate comparison
    const normalizedUrl = currentUrl.split('?')[0].replace(/\/$/, '');

    // Ensure correct comparison logic based on your routing configuration
    return normalizedUrl === routeLink;
  }

  // getIconClass(iconName: string) {
  //   // Map icon names to corresponding CSS classes
  //   const iconClasses = {
  //     home: 'home',
  //     plus: 'plus',
  //     people: 'people',
  //     user: 'user', // Assuming 'user' icon for profile
  //   };

  //   return iconClasses[iconName] || ''; // Return default class if not found
  // }

  /////////////////////// Logout ///////////////////////

  logoutUser() {
    // Clear local storage, session storage, or cookies (choose the right approach)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userData'); // Assuming you store user data here
    this.router.navigate(['/login']); // Replace with your login route
    console.log('Logout user initiated!');
    // Or:
    // this.cookieService.delete('your_auth_cookie_name'); // If you use cookies
    // Reset any additional user-related state in your application
    this.tokenService.removeToken(); // Assuming you have a token service
    // this.authService.logout(); // If you use an authentication service
    // Redirect to login page or appropriate default route
    // Optionally, display a success message to the user
    //   this.msgService.add({
    //     severity: 'success',
    //     summary: 'Logout Successful',
    //     detail: 'You have been logged out.',
  }
}
