// user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = 'http://127.0.0.1:8000/api/user-detail/';

  constructor(private http: HttpClient) {}

  searchUsers(query: string): Observable<any[]> {
    const url = `${this.apiUrl}?q=${query}`;
    return this.http.get<any[]>(url);
  }
}

