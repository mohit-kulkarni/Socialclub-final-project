import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpswd',
  templateUrl: './forgetpswd.component.html',
  styleUrls: ['./forgetpswd.component.scss']
})
export class ForgetpswdComponent {
  username: string;
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
  isSubmitted: boolean = false;
  otpSubmitted: boolean = false;
  passwordUpdated: boolean = false;
  userExist: boolean = false;
  otpValid: boolean = false;
  showOtpBox: boolean = false;
  router: Router = inject(Router);



  constructor(private http: HttpClient) { }

  submitForm() {
    this.isSubmitted = true;
    // Send username and email to backend for further processing
    this.http.post<any>('http://127.0.0.1:8000/api/check-user-exists/', { username: this.username, email: this.email }).subscribe(response => {
      if (response.message === 'user exists') {
        this.otpSubmitted = true;
        this.userExist = true;
        console.log('user exist');
        alert('OTP sent successfully')
      } else {
        this.userExist = false;
        // Handle error or display appropriate message
        console.log('user does not exist');
      }
    }, error => {
      // Handle error
      console.error(error);
    });
  }

  submitOTP() {
    // Validate OTP (Constant: 345678)
    if (this.otp === '345678') {
      console.log('otp verified');
      this.otpValid = true;
      // this.passwordUpdated = true;
    } else {
      // Handle incorrect OTP
      console.log('incorrect OTP');
    }
  }

  updatePassword() {
    // Validate newPassword and confirmPassword
    if (this.newPassword !== this.confirmPassword) {
      // Display error message or handle validation accordingly
      console.log('password and confirm password does not match');
      return;
    }
    // Call backend API to update password
    this.http.post<any>('http://127.0.0.1:8000/api/update-password/', { newPassword: this.newPassword, username: this.username }).subscribe(response => {
      // Handle success
      this.passwordUpdated = true;
      console.log('Password updated successfully');
      this.router.navigate(['/login']);
      
    }, error => {
      // Handle error
      console.error('Password not updated, please try again.');
    });
  }
}
