import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { SendRequestService } from '../../services/send-request.service';
import { User } from '../../interfaces/user';
import { Observable } from 'rxjs';
import { FriendRequestService } from '../../services/friend-request.service';
import Swal from 'sweetalert2';

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
  fullName = `${sessionStorage.getItem('fname')} ${sessionStorage.getItem(
    'lname'
  )}`;
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
          this.friendRequestService.checkIsFriend(user.user).subscribe(
            (isFriend) => {
              user.isFriend = isFriend;
              // console.log(isFriend);
              // console.log(user);

              // console.log(
              //   `Friendship status for user: ${user.username} is: ${isFriend}`
              // );
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
    const loggedInUser = sessionStorage.getItem('userId');
    this.users = this.users.filter(
      (user: User) => !user.isFriend && user.user !== +loggedInUser
    );
    // console.log(this.users);

    // console.log('Not Friends: ', this.users);
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
          Swal.fire({
            title: 'Success!',
            text: 'Follow Request sent Successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'User not Found!',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      },
      (error) => {
        console.error('Error sending friend request:', error);
        Swal.fire({
          title: 'Error!',
          text: `Error sending friend request!, ${error}`,
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  generateImageLink(imageSource): string {
    return `http://localhost:8000/${imageSource}`;
  }
}
