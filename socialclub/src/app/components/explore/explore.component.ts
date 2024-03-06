import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FriendRequestService } from '../../services/friend-request.service';
import { User } from '../../interfaces/user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  friendRequests: any[] = [];
  users: User[] = [];
  imageLink: string;

  constructor(
    private friendRequestService: FriendRequestService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getPendingFriendRequests();
  }

  getPendingFriendRequests(): void {
    this.friendRequestService.getPendingFriendRequests().subscribe(
      (data) => {
        this.friendRequests = data;
        console.log('Friend Requests: ', this.friendRequests);
        this.fetchUserDetails();
      },
      (error) => {
        console.error('Failed to get friend requests', error);
      }
    );
  }

  fetchUserDetails(): void {
    this.friendRequests.forEach((request) => {
      this.userService.getUserById(request.from_user_id).subscribe(
        (user: User) => {
          // Add the user details to the friend request object
          request.from_user = user;
          console.log('user:', user);

          // Set the image URL in the friend request object
          this.imageLink = this.generateImageLink(user.profile_pic);
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    });
  }

  sendFriendRequest(toUserId: number): void {
    this.friendRequestService.sendFriendRequest(toUserId).subscribe(
      (response) => {
        // Handle success
        console.log('Friend request sent successfully', response);
      },
      (error) => {
        // Handle error
        console.error('Failed to send friend request', error);
      }
    );
  }

  acceptFriendRequest(requestId: number): void {
    this.friendRequestService.acceptFriendRequest(requestId).subscribe(
      (response) => {
        // Handle success
        console.log('Friend request accepted successfully', response);
        this.getPendingFriendRequests();
      },
      (error) => {
        // Handle error
        console.error('Failed to accept friend request', error);
      }
    );
  }

  rejectFriendRequest(requestId: number): void {
    this.friendRequestService.rejectFriendRequest(requestId).subscribe(
      (response) => {
        // Handle success
        console.log('Friend request rejected successfully', response);
        this.getPendingFriendRequests();
      },
      (error) => {
        // Handle error
        console.error('Failed to reject friend request', error);
      }
    );
  }

  generateImageLink(imageSource): string {
    return `http://localhost:8000/${imageSource}`;
  }
}
