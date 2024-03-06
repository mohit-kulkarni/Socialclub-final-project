import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SendRequestService {
  private baseUrl = 'http://127.0.0.1:8000/api/friend-requests/'; // Replace this with your Django backend URL

  constructor(private http: HttpClient) { }

  sendRequest(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}`, { userId });
  }
}
