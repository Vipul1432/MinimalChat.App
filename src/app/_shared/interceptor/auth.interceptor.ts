import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toasterService: NgToastService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    // Get the JWT token from localStorage
    const token = localStorage.getItem('token');

    // Check if the token exists
    if (token) {
      // Decode the token to access its claims, including 'exp' (expiration time)
      const tokenPayload = this.decodeToken(token);

      if (tokenPayload.exp) {
        // Get the current timestamp in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        console.log(
          `exp time is :  ${tokenPayload.exp} and current time is : ${currentTime}`
        );

        // Compare 'exp' claim with the current timestamp
        if (tokenPayload.exp > currentTime) {
          // Token is still valid, add it to the request headers
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          });

          const modifiedRequest = request.clone({ headers });
          return next.handle(modifiedRequest);
        } else {
          // Token has expired, redirect to the login page
          this.authService.setAuthenticationStatus(false);
          this.toasterService.warning({
            detail: 'WARN',
            summary: 'Token has expires login again!',
            duration: 3000,
            position: 'bottomRight',
          });
          this.router.navigate(['/login']);
          return EMPTY;
        }
      }
    }

    return next.handle(request);
  }

  private decodeToken(token: string) {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      return null; // Token decoding failed
    }
  }
}
