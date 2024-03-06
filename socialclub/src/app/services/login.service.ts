import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit, inject } from "@angular/core";
import { TokenService } from "./token.service";
import { Router } from "@angular/router";
import { Observable, catchError, throwError } from "rxjs";
import { User } from "../interfaces/user";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // Authorization: 'Token ad8e916386e1387dca6e320fbb72646e3caa3e57'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: object | any = null
  http: HttpClient = inject(HttpClient);
  tokenService: TokenService = inject(TokenService);
  router: Router = inject(Router)

  

  CreateUser(user: User): Observable<any> {
    return this.http.post('http://localhost:8000/api/users/', user, httpOptions);
  }

  logInUser(credentials: any): Observable<any> {
    // console.log(credentials);
    return this.http.post('http://localhost:8000/api/login/', credentials, httpOptions)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return throwError('*Invalid credentials. Please check your username and password.');
          } else {
            console.error('An error occurred:', error.error);
            return throwError('Login failed. Please try again.');
          }
        })
      );
  }
}
