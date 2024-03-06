import { inject, resolveForwardRef } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { UserService } from '../services/user.service';
import { Observable, switchMap, timer } from 'rxjs';

export class CustomValidators {
  static passwordMismatch(control: AbstractControl) {
    const password = control.get('password').value;
    const cpassword = control.get('cpassword').value;
    if (password === cpassword) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }
}
