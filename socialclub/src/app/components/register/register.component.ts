import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { User } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { passwordMatchValidator } from '../../shared/password-match.directive';
import { CustomValidators } from '../../Validators/custom.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMessage: string = '';
  showErrorCreateUserMsg: string = '';
  showCreateUserMsg: string = '';
  showSuccessCreateUserMsg: string = '';
  showUserImg: string;

  // registerForm = this.fb.group(
  //   {
  //     username: [
  //       '',
  //       [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
  //     ],
  //     email: ['', [Validators.required, Validators.email]],
  //     password: ['', Validators.required],
  //     confirmPassword: ['', Validators.required],
  //   },
  //   {
  //     validators: passwordMatchValidator,
  //   }
  // );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = new FormGroup(
      {
        fname: new FormControl(null, Validators.required),
        lname: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        username: new FormControl(null, Validators.required),
        dob: new FormControl(null, Validators.required),
        gender: new FormControl('F'),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
          ),
        ]),
        cpassword: new FormControl(null, [Validators.required]),
        userImg: new FormControl(null),
      },
      {
        validators: CustomValidators.passwordMismatch,
      }
    );
  }

  onFileSelected(event: any): void {
    const fileInput = event.target;
    if (fileInput.files.length > 0) {
      // Set the selected image file to the form control
      this.registerForm.get('userImg').setValue(fileInput.files[0].name);

      // Image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.showUserImg = reader.result as string;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  GenerateUserName() {
    let username = '';

    const fName: string = this.registerForm.get('fname').value;
    const lName: string = this.registerForm.get('lname').value;

    if (fName.length >= 3) {
      username += fName.slice(0, 3);
    } else {
      username += fName;
    }
    if (lName.length >= 3) {
      username += lName.slice(0, 3);
    } else {
      username += lName;
    }
    username += '_';
    username += (Math.floor(Math.random() * 900) + 100).toString();
    username = username.toLowerCase();

    // console.log(username);
    this.registerForm.patchValue({
      username: username,
    });
  }

  get username() {
    return this.registerForm.controls['username'];
  }

  get email() {
    return this.registerForm.controls['email'];
  }

  get password() {
    return this.registerForm.controls['password'];
  }

  get confirmPassword() {
    return this.registerForm.controls['confirmPassword'];
  }

  submitDetails() {
    const postData = { ...this.registerForm.value };
    console.log(postData);

    delete postData.confirmPassword;
    this.authService.registerUser(postData as User).subscribe({
      next: (response) => {
        console.log(response);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Register successfully',
        });
        this.router.navigate(['login']);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Something went wrong',
        });
      },
    });
  }
}
