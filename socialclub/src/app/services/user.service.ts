import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { FriendRequestService } from './friend-request.service';

const base_url: string = 'http://127.0.0.1:8000/api/user-details/';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private friendRequestService: FriendRequestService
  ) {}

  newUserRegister(userData: any): Observable<any> {
    return this.http.post(`${base_url}`, userData);
  }

  getAllUsers(): Observable<User[]> {
    console.log(`GET request sent to ${base_url}`);
    return this.http.get<User[]>(`http://127.0.0.1:8000/api/user-detail/`);
  }

  getUserById(userid: number): Observable<User> {
    return this.http.get<User>(`${base_url}${userid}/`);
  }

  getUserByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${base_url}?email=${email}`);
  }

  getUserByUserName(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${base_url}?username=${username}`);
  }

  // Get users who are not friends
  getNonFriendUsers(): Observable<User[]> {
    // First, get all users
    return this.getAllUsers().pipe(
      switchMap((users) => {
        // Then, filter out the friends
        return this.friendRequestService
          .checkIsFriendBatch(users.map((user) => user.id))
          .pipe(
            map((friendStatuses) => {
              return users.filter((user, index) => !friendStatuses[index]);
            })
          );
      })
    );
  }

  // Get users who are friends
  getFriendUsers(): Observable<User[]> {
    // First, get all users
    return this.getAllUsers().pipe(
      switchMap((users) => {
        // Then, filter in the friends
        return this.friendRequestService
          .checkIsFriendBatch(users.map((user) => user.id))
          .pipe(
            map((friendStatuses) => {
              return users.filter((user, index) => friendStatuses[index]);
            })
          );
      })
    );
  }
}
