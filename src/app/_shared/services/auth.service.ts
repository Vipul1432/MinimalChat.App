import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { RegistrationModel } from '../models/RegistrationModel';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  isAuthenticated = false;
  private userName: string | null = null;

  constructor(private http: HttpClient) {
    this.checkAuthenticationStatus();
  }

  registerUser(user: RegistrationModel): Observable<any> {
    const url = `${this.apiUrl}register`;
    return this.http.post(url, user);
  }
  loginUser(user: { email: string; password: string }): Observable<any> {
    const url = `${this.apiUrl}login`; 
    return this.http.post(url, user).pipe(
      tap((response: any) => {
        if (response && response.data.jwtToken) {
          localStorage.setItem('token', response.data.jwtToken);
          this.isAuthenticated = true;
          this.userName = this.fetchUserNameFromToken(response.data.jwtToken);
        }
      })
    );
  }

  getUserName(): string | null {
    return this.userName;
  }

  private checkAuthenticationStatus(): void {
    const token = localStorage.getItem('token');

    if (token) {
      // User is authenticated
      this.isAuthenticated = true;
      this.userName = this.fetchUserNameFromToken(token); 
    } else {
      // User is not authenticated
      this.isAuthenticated = false;
      this.userName = null;
    }
  }
  private fetchUserNameFromToken(token: string): string | null {
    try {
      // Decode the JWT token
      const decodedToken: any = jwt_decode(token);
  
      const username: string | undefined = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
  
      // Return the username if found
      if (username) {
        return username;
      } else {
        // Username not found in the token
        return null;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}
