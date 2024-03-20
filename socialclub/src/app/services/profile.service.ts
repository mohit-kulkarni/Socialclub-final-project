import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = 'http://127.0.0.1:8000/api/'; // Your API base URL
  private apiUrl = 'http://127.0.0.1:8000/api/user-profile/';

  constructor(private http: HttpClient) {}

  getProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}user-profile/${userId}/`);
  }

  updateUserProfile(userId: number, userData: any): Observable<any> {
    console.log(userData, 'userData');
    return this.http.patch<any>(`${this.apiUrl}${userId}/`, userData);
  }

  getFollowerCount(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/follower_count/${userId}/`);
  }

  getFollowingCount(userId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:8000/api/following_count/${userId}/`);
  }

  
}
