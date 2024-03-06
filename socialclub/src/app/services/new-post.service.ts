// your-service.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewPostService {
  private apiUrl = 'http://127.0.0.1:8000/api/post/';

  constructor(private http: HttpClient) {}

  postData(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
