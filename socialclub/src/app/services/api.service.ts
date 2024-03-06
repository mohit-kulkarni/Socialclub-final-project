import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api';
  private auth_token = sessionStorage.getItem('auth_token');

  constructor(private http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/post/`);
  }

  getFriendsPosts(): Observable<Post[]> {
    const headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      Authorization: `Token ${this.auth_token}`, // Assuming token is stored in sessionStorage
    });
    // Make a request to the backend endpoint that fetches posts from friends
    return this.http.get<Post[]>(`${this.baseUrl}/friends-posts/`, { headers });
  }
}
