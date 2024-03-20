import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  loggedInUserId: string | null = null;
  isOwner = false;
  user: any;
  imageLink;
  followingCount: number = 0;
  followerCount: number = 0;
  postCount: number =0;
  isEditMode = false;
  profileImageFile: File | null = null;

  searchControl = new FormControl();
  @Output() profileImageChange = new EventEmitter<string>();

  constructor(
    private profileService: ProfileService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const userIdFromUrl = params['userId'];

      this.profileService.getProfile(userIdFromUrl).subscribe(
        (userData) => {
          this.user = userData;
          this.loggedInUserId = sessionStorage.getItem('userId');
          console.log(this.user);

          if (
            this.loggedInUserId &&
            this.user &&
            this.user.user.toString() === this.loggedInUserId
          ) {
            this.isOwner = true;
          }

          if (this.user && this.user.profileImage) {
            this.imageLink = this.generateImageLink(this.user.profileImage);
          }
        },
        (error) => {
          console.error('Error fetching user data:', error);
        }
      );

      this.profileService.getFollowingCount(userIdFromUrl).subscribe(
        data => {
          this.followingCount = data.following_count;
        },
        error => {
          console.error('Error fetching follower count:', error);
        }
      );

      this.profileService.getFollowerCount(userIdFromUrl).subscribe(
        data => {
          this.followerCount = data.follower_count;
        },
        error => {
          console.error('Error fetching follower count:', error);
        }
      );


    });
  }

  onProfileImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        // Convert the image file to a base64 string
        const base64Image = reader.result as string;

        // Emit the base64 string to the parent component or service
        this.profileImageChange.emit(base64Image);
      };

      reader.readAsDataURL(file);
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    console.log(sessionStorage.getItem('userId')); // You need to replace this with the actual userId
    const userId = parseInt(sessionStorage.getItem('userId'), 10);
    // const userId=33
    // if (this.profileImageFile) {
    //   const formData = new FormData();
    //   formData.append('name', this.user.name);
    //   formData.append('email', this.user.email);
    //   formData.append('profileImage', this.profileImageFile);

    // this.profileService.updateProfile(userId, formData).subscribe(
    //   (response) => {
    //     console.log('Changes saved:', response);
    //     // You can handle success notification here if needed
    //     this.route.navigate(['/home']);
    //   },
    //   (error) => {
    //     console.error('Error saving changes:', error);
    //     // You can handle error notification here if needed
    //   }
    // );
    // } else {
    const profileData = {
      name: this.user.name,
      email: this.user.email,
      profileImage: this.user.profileImage,
    };
    this.profileService.updateUserProfile(userId, profileData).subscribe(
      (response) => {
        // You can handle success notification here if needed
        // this.route.navigate(['/home']);
        console.log('Changes saved:', response);
      },
      (error) => {
        console.error('Error saving changes:', error);
        // You can handle error notification here if needed
      }
    );
    // }
  }

  generateImageLink(imageSource): string {
    return `http://localhost:8000/${imageSource}`;
  }
}
