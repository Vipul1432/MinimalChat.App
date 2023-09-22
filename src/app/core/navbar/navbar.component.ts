import { Component } from '@angular/core';
import { AuthService } from 'src/app/_shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
title: string = 'Mimimal Chat App'
userName: string | null = null;
isAuthenticated = false;

  constructor(private authService: AuthService) {
    // Check authentication status when the component initializes
    this.checkAuthentication();
  }

  // Check if the user is logged in
  async checkAuthentication() {
    this.isAuthenticated = this.authService.isAuthenticated;
    
    // If the user is authenticated, get their name
    if (this.isAuthenticated) {
      this.userName = await this.authService.getUserName();
    }
  }

  // Logout the user
  logout() {
    // this.authService.logout();
  }
}
