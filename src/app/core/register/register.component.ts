import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { passwordMatchValidator } from 'src/app/_helpers/validators/password-match.validator';
import { RegistrationModel } from 'src/app/_shared/models/RegistrationModel';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { environment } from '../../_shared/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  hidePassword = true;
  hideConfirmPassword = true;
  registrationForm: FormGroup;
  registrationResult: any;
  private clientId = environment.clientId;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toasterService: NgToastService,
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.registrationForm = this.fb.group(
      {
        fullname: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/
            ),
          ],
        ],
        confirmpassword: ['', [Validators.required]],
      },
      {
        validator: passwordMatchValidator('password', 'confirmpassword'),
      }
    );
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

            this.router.navigateByUrl('/login');
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
   * Handles the submission of a registration form.
   * If the form is valid, attempts to register the user.
   */
  onSubmit() {
    if (this.registrationForm.valid) {
      let user: RegistrationModel = {
        name: this.registrationForm.get('fullname')!.value,
        email: this.registrationForm.get('email')!.value,
        password: this.registrationForm.get('password')!.value,
      };
      this.authService.registerUser(user).subscribe(
        (response: any) => {
          this.registrationResult = response;
          console.log(response);

          if (response.statusCode === 200) {
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: `${response.data.name} Registration successful`,
              duration: 5000,
            });
            this.router.navigateByUrl('/login');
          } else if (response.statusCode === 409) {
            this.toasterService.error({
              detail: 'ERROR',
              summary: 'Email is already registered!',
              sticky: true,
            });
          } else {
            this.toasterService.error({
              detail: 'ERROR',
              summary: 'Registration failed',
              sticky: true,
            });
          }
        },
        (error) => {
          console.error('Registration failed:', error);
          this.toasterService.error({
            detail: 'ERROR',
            summary: 'Registration failed',
            sticky: true,
          });
          this.registrationResult = null;
        }
      );
    }
  }

  /**
   * Toggles the visibility of the password input field.
   *
   * @param event - The event triggering the visibility toggle (e.g., a button click).
   */
  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Toggles the visibility of the confirm password input field.
   *
   * @param event - The event triggering the visibility toggle (e.g., a button click).
   */
  toggleConfirmPasswordVisibility(event: Event) {
    event.preventDefault();
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
}
