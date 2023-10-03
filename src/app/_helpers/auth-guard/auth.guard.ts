import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.router.url === '/login' || this.router.url === '/register') {
        // Redirect authenticated users away from '/login' and '/register' to '/chat'.
        console.log(`redirect`);
        this.router.navigate(['/chat']);
      }
      if (this.router.url === '/chat/user/') {
        console.log(`redirect`);
        this.router.navigate(['/chat/user/']);
      }
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
