import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  /**
   * Retrieves a list of users from the API.
   *
   * @returns An Observable containing an array of User objects representing users.
   *          Subscribers can handle the response asynchronously.
   */
  getAllUsers(): Observable<User[]> {
    const url = `${this.apiUrl}users`;
    return this.http.get<User[]>(url);
  }
}
