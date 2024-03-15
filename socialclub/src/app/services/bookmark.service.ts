// bookmark.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private apiUrl = 'http://127.0.0.1:8000/api/bookmarks/';

  constructor(private http: HttpClient) { }

  bookmarkPost(postId: number, userId:number): Observable<any> {
    const body = {
      user: userId,
      post: postId
    };
    return this.http.post<any>(this.apiUrl,body);
  }
  getUserBookmarks(userId: number): Observable<any[]> {
    // const url = `${this.apiUrl}${userId}/`;
    return this.http.get<any[]>(`http://127.0.0.1:8000/api/bookmarks/${userId}/`);
  }
}
