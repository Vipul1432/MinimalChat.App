import { ValidatorFn, Validators } from '@angular/forms';

export const environment = {
  apiUrl: 'https://localhost:7038/api/',
  clientId:
    '633863692752-e65kt2hm01k5726s6q6uv3nqllgp3sh7.apps.googleusercontent.com',
  identityClaimName:
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  identityClaimNameIdentifier:
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  chatHubUrl: 'https://localhost:7038/chatHub',
};

export const PASSWORD_REGEX: ValidatorFn = Validators.pattern(
  /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{6,}$/
);
