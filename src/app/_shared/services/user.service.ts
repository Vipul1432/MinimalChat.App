import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  /**
 * Retrieves a JSON Web Token (JWT) from local storage.
 *
 * @returns The JWT token as a string if it's stored in local storage, or null if not found.
 */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
 * Creates HttpHeaders with the necessary authentication headers.
 *
 * @returns HttpHeaders object with "Content-Type" and "Authorization" headers.
 */
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
 * Retrieves a list of users from the API.
 *
 * @returns An Observable containing an array of User objects representing users.
 *          Subscribers can handle the response asynchronously.
 */
  getAllUsers(): Observable<User[]> {
    const url = `${this.apiUrl}users`;
    const headers = this.getHeaders();
    return this.http.get<User[]>(url, { headers });
  }
}
