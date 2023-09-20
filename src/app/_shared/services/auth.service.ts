import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { RegistrationModel } from '../models/RegistrationModel';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registerUser(user: RegistrationModel): Observable<any> {
    const url = `${this.apiUrl}register`;
    return this.http.post(url, user);
  }
}
