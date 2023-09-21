import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { LoginForm } from 'src/app/_shared/models/LoginForm';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private toasterService: NgToastService
    ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/)
        ]
      ]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      let user: LoginForm = {
        email: this.loginForm.get('email')!.value,
        password: this.loginForm.get('password')!.value,
      };
      this.authService.loginUser(user).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          if (response.statusCode === 200) {
            this.toasterService.success({
              detail: "SUCCESS",
              summary: `Login successful`,
              duration: 5000
            });            
            this.router.navigateByUrl('/chat');
          } else if (response.statusCode === 401) {
            this.toasterService.error({
              detail: "ERROR",
              summary: "Login failed due to incorrect credentials!",
              sticky: true
            });
          } else {
            this.toasterService.error({
              detail: "ERROR",
              summary: "Login failed",
              sticky: true
            });
          }
        },
        (error) => {
          console.error('Login failed:', error);
          this.toasterService.error({
            detail: "ERROR",
            summary: "Login failed",
            sticky: true
          });
        }
      );
    }
  }

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
