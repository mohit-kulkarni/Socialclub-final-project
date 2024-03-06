// profile.component.ts

import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  user = {
    name: sessionStorage.getItem('username'),
    email: sessionStorage.getItem('email'),
    profileImage: sessionStorage.getItem('profile_pic'),
    followers: 500,
    following: 200,
    posts: 100,
  };
  imageLink = this.generateImageLink(this.user.profileImage)

  isEditMode = false;
  profileImageFile: File | null = null; // Add this line if you want to handle profile image file uploads

  searchControl = new FormControl();
  @Output() profileImageChange = new EventEmitter<string>();

  // ...

  onProfileImageChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      const file = files[0];

      // You may want to handle file uploads and update the user's profile image
      // For simplicity, we'll just set the profileImage to a base64 representation of the file
      const reader = new FileReader();
      reader.onload = () => {
        this.user.profileImage = reader.result as string;
        this.profileImageChange.emit(this.user.profileImage);
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  saveChanges(): void {
    // Implement the logic to save changes (e.g., call a service to update user data)
    console.log('Changes saved:', this.user);
  }
  generateImageLink(imageSource): string {
    return `http://localhost:8000/${imageSource}`;
  }

}
