import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_shared/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  title: string = 'Mimimal Chat App';
  userName: string | null = null;
  isAuthenticated = false;
  private userChatSubscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router) {
    // Check authentication status when the component initializes
    this.checkAuthentication();
  }

  ngOnInit(): void {
    // Subscribe to changes in authentication status
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;

      // When authentication status changes, check user authentication
      this.checkAuthentication();
    });
  }

  /**
   * Checks the user's authentication status and retrieves their name if authenticated.
   */
  async checkAuthentication() {
    // If the user is authenticated, get their name
    if (this.isAuthenticated) {
      this.userName = await this.authService.getUserName();
    } else {
      if (this.userName == null || this.userName == '') {
        this.userName = await localStorage.getItem('userName');
        console.log(`loggg` + this.userName);
        this.isAuthenticated = true;
      }
    }
  }

  // Logout the user
  logout() {
    this.isAuthenticated = false;
    this.authService.logout();
    this.userName = null;
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.userChatSubscription) {
      this.userChatSubscription.unsubscribe();
    }
  }
}
