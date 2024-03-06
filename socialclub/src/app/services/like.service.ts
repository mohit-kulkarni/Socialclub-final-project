import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = 'http://127.0.0.1:8000/api/'; // Change this to your API endpoint

  constructor(private http: HttpClient) {}

  // Method to like a post
  likePost(postId: number, userId: number): Observable<any> {
    // Assuming you need to send both post id and user id
    const body = {
      user: userId,
      post: postId
    };

    // Send a POST request to the API endpoint for liking the post
    return this.http.post<any>(`${this.apiUrl}like/`, body);
  }
}
