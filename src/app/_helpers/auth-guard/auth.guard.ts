import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../_shared/services/auth.service'; // You need to have an AuthService for checking the user's login status.

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/chat']); 
      return false;
    }
    return true;
  }
}
