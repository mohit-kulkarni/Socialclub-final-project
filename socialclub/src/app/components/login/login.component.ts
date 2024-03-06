import { Component, Inject, inject, OnInit } from '@angular/core';

import {
  Form,
  FormArray,
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from '../../Validators/custom.validator';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userService: UserService = inject(UserService);
  tokenService: TokenService = inject(TokenService);
  router: Router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  // constructor(
  //   private fb: FormBuilder,
  //   private authService: AuthService,
  //   private router: Router,
  //   private msgService: MessageService,
  //   private userService: UserService
  // ) {}

  get username() {
    return this.loginForm.controls['username'];
  }
  get password() {
    return this.loginForm.controls['password'];
  }

  loginUser() {
    // const { username, password } = this.loginForm.value;
    // this.userService.getUserByUserName(username as string).subscribe({
    //   next: (response) => {
    //     if (response.length > 0 && response[0].password === password) {
    //       sessionStorage.setItem('username', username as string);
    //       console.log(`Navigate to /home`);
    //       this.router.navigate(['/home']);
    //     } else {
    //       this.msgService.add({
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: 'email or password is wrong',
    //       });
    //     }
    //   },
    //   error: (error) => {
    //     this.msgService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: 'Something went wrong',
    //     });
    //   },
    // });

    this.userService.logInUser(this.loginForm.value).subscribe(
      (response: any) => {
        const token = response.token;
        const userData = response.userData;
        console.log(token);
        console.log(userData);

        if (Boolean(userData.is_approved) === true) {
          this.tokenService.setToken(token);
          this.tokenService.setUserInfo(userData);
          this.loginForm.reset();
          // sessionStorage.setItem('token', token);
          // sessionStorage.setItem('userData', userData);
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = 'Please wait for approval!!!';
          this.loginForm.reset();
          console.log(this.errorMessage);
        }
      },
      (error: string) => {
        this.errorMessage = error;
        console.error('Login error', error);
      }
    );
  }
}
