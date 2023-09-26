import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_shared/services/auth.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {    
    const isAuthenticated = this.authService.isAuthenticated;

    if (isAuthenticated) {
      this.router.navigate(['/chat']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
