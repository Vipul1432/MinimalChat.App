import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(controlName)!;
    const confirmPasswordControl = formGroup.get(matchingControlName)!;

    if (!passwordControl.value || !confirmPasswordControl.value) {
      // Don't show error if either field is empty
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      // Set error directly on the Confirm Password field
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear error if they match
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}
