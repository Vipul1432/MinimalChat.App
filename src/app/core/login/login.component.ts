import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { LoginForm } from 'src/app/_shared/models/LoginForm';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from '../../_shared/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  hidePassword = true;
  loginForm: FormGroup;
  private clientId = environment.clientId;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toasterService: NgToastService,
    private _ngZone: NgZone
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/),
        ],
      ],
    });
  }

  /**
   * Angular lifecycle hook called when the component is initialized.
   * Initializes and renders a Google Sign-In button.
   */
  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById('buttonDiv'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  /**
   * Handles the response received after a Google Sign-In attempt.
   *
   * @param response - The response object containing credential information.
   */
  private handleCredentialResponse(response: CredentialResponse) {
    this.authService
      .LoginWithGoogle(response.credential)
      .subscribe((x: any) => {
        this._ngZone.run(() => {
          if (x.statusCode === 200) {
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: `Login successful`,
              duration: 5000,
            });

            this.router.navigateByUrl('/chat');
          } else {
            this.toasterService.error({
              detail: 'ERROR',
              summary: 'Login failed',
              sticky: true,
            });
          }
        });
      });
  }

  /**
   * Handles the submission of a login form.
   * If the form is valid, attempts to log in the user.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      let user: LoginForm = {
        email: this.loginForm.get('email')!.value,
        password: this.loginForm.get('password')!.value,
      };
      this.authService.loginUser(user).subscribe(
        (response: any) => {
          if (response.statusCode === 200) {
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: `Login successful`,
              duration: 5000,
            });
            this.router.navigateByUrl('/chat');
          } else {
            this.toasterService.error({
              detail: 'ERROR',
              summary: 'Login failed',
              sticky: true,
            });
          }
        },
        (error) => {
          if (error.status === 401 || error.status === 400) {
            this.toasterService.error({
              detail: 'ERROR',
              summary: error.error.message,
              sticky: true,
            });
          }
        }
      );
    }
  }

  /**
   * Toggles the visibility of the password input field.
   *
   * @param event - The event triggering the visibility toggle.
   */
  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }
}
