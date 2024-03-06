import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  postComment(
    userId: number,
    postId: number,
    comment: string
  ): Observable<any> {
    console.log(postId, comment);
    const body = {
      user: userId,
      post: postId,
      text: comment,
    };
console.log(body,'body')
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<any>(`${this.baseUrl}/comment/`, body, { headers }); // Adjust the type accordingly
  }
  

  getComments(postId: number): Observable<any[]> {
    // const headers = new HttpHeaders().set('Content-Type', 'application/json')
    // return this.http.get<any[]>(`${this.baseUrl}/comment/`);
    return this.http.get<any[]>(`${this.baseUrl}/comment/?post=${postId}&_expand=user`);
  }
}
