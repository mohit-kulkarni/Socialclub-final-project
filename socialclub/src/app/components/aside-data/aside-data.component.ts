import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SendRequestService } from '../../services/send-request.service';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { FriendRequestService } from '../../services/friend-request.service';

@Component({
  selector: 'app-aside-data',
  templateUrl: './aside-data.component.html', // Ensure path is correct
  styleUrls: ['./aside-data.component.scss'],
})
export class AsideDataComponent implements OnInit {
  userImageSource: string; // Default image
  year: number = new Date().getFullYear();
  users: User[] | any = []; // Initialize empty user array
  loggedInUser: string | null = sessionStorage.getItem('username');
  LoggedInEmail: string | null = sessionStorage.getItem('email');
  // filteredUsers: any[];

  constructor(
    private userService: UserService,
    private friendRequestService: FriendRequestService
  ) {}

  ngOnInit(): void {
    // Fetch users and logged-in user info (if available)
    this.fetchUsers();

    // Retrieve profile picture URL from local storage (if set)
    const profilePic = sessionStorage.getItem('profile_pic');
    if (profilePic) {
      this.userImageSource = profilePic;
    }

    this.userImageSource = this.generateImageLink(this.userImageSource);
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
        // After fetching users, check if each user is a friend
        this.users.forEach((user: User) => {
          this.friendRequestService.checkIsFriend(user.id).subscribe(
            (isFriend) => {
              user.isFriend = isFriend;
              console.log(isFriend);
              this.filterFriends();
            },
            (error) => {
              console.error('Error checking friend status:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  filterFriends(): void {
    this.users = this.users.filter((user: User) => !user.isFriend);
    console.log('Not Friends: ', this.users);
  }

  sendFollowRequest(toUserId: number): void {
    this.friendRequestService.sendFriendRequest(toUserId).subscribe(
      () => {
        // Find the index of the user to remove
        const index = this.users.findIndex((user) => user.user === toUserId);
        if (index !== -1) {
          // Remove the user from the list after sending the friend request
          this.users.splice(index, 1);
          console.log('Friend request sent successfully');
          alert('Friend request sent successfully');
        } else {
          console.error('User not found in the list');
        }
      },
      (error) => {
        console.error('Error sending friend request:', error);
      }
    );
  }

  generateImageLink(imageSource): string {
    return `http://localhost:8000/${imageSource}`;
  }
}
