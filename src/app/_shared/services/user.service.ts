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

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Add JWT token to headers
  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Method to fetch all users
  getAllUsers(): Observable<User[]> {
    const url = `${this.apiUrl}users`;
    const headers = this.getHeaders();
    return this.http.get<User[]>(url, { headers });
  }
}
