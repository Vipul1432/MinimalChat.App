import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService,
    private toasterService: NgToastService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return this.handleUnAuthorizedError(request, next);
          }
        }
        return throwError(() => error);
      })
    );
  }

  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = localStorage.getItem('token');
    return this.authService.getRefreshToken(token!, refreshToken!).pipe(
      switchMap((data: any) => {
        console.log(data);
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${data.data.accessToken}`,
          },
        });
        return next.handle(req);
      }),
      catchError((err) => {
        return throwError(() => {
          this.toasterService.warning({
            detail: 'Warning',
            summary: 'Token is expired, Please Login again',
            duration: 3000,
          });
          // this.authService.logOut();
          this.router.navigate(['/login']);
        });
      })
    );
  }
}
