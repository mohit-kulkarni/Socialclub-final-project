import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendRequestService {
  private apiUrl = 'http://localhost:8000/api/';
  private auth_token = sessionStorage.getItem('auth_token');
  private fromUserId = sessionStorage.getItem('userId');

  constructor(private http: HttpClient) {}

  sendFriendRequest(toUserId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });
    const body = { from_user_id: this.fromUserId, to_user_id: toUserId };
    console.log(`user: ${this.fromUserId} sent request to ${toUserId}`);

    return this.http.post<any>(`${this.apiUrl}send-friend-request/`, body, {
      headers,
    });
  }

  acceptFriendRequest(requestId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });

    return this.http.put<any>(
      `${this.apiUrl}friend-request/${requestId}/accept/`,
      {},
      { headers }
    );
  }

  rejectFriendRequest(requestId: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });

    return this.http.put<any>(
      `${this.apiUrl}friend-request/${requestId}/reject/`,
      {},
      { headers }
    );
  }

  getPendingFriendRequests(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });

    return this.http.get<any[]>(`${this.apiUrl}pending-friend-requests/`, {
      headers,
    });
  }

  checkIsFriend(userId: number): Observable<boolean> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });

    return this.http.get<boolean>(`${this.apiUrl}is-friend/${userId}/`, {
      headers,
    });
  }

  // Batch check for friendship status
  checkIsFriendBatch(userIds: number[]): Observable<boolean[]> {
    const headers = new HttpHeaders({
      Authorization: `Token ${this.auth_token}`, // Include the token in the Authorization header
    });

    // Create query parameters with comma-separated user IDs
    const params = new HttpParams().set('user_ids', userIds.join(','));

    return this.http.get<boolean[]>(`${this.apiUrl}is-friend/batch`, {
      headers,
      params,
    });
  }
}
