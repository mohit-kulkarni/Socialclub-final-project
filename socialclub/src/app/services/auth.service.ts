import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interfaces/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8000/api';


  constructor(private http: HttpClient) { }

  registerUser(userDetails: User) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`http://127.0.0.1:8000/api/users/`, userDetails, {headers});
  }

  getUserByEmail(email: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users?email=${email}`);
  }


  // Check if user is logged in
  isLoggedIn(): boolean {
    // Check if user details exist in session storage
    return (
      sessionStorage.getItem('username') !== null &&
      sessionStorage.getItem('auth_token') !== null &&
      sessionStorage.getItem('userId') !== null
    );
  }
}
