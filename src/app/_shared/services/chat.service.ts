import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserChat } from '../models/UserChat';
import { Log } from '../models/Log';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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

  getUserChat( 
    UserId: string,
    Before: Date | null,
    count: number | null,
    sortOrder: number | null
    ): Observable<UserChat[]> {
    const url = `${this.apiUrl}messages`;
    const headers = this.getHeaders();
    let params = new HttpParams().set('UserId', UserId);
      if (Before !== null) {
        params = params.set('before', Before.toString());
      }  
      if (count !== null) {
        params = params.set('count', count.toString());
      }
      if (sortOrder !== null) {
        params = params.set('sortOrder', sortOrder.toString());
      }
    return this.http.get<UserChat[]>(url, { headers, params });
  }

  sendMessage(receiverId: string, content: string): Observable<any> {
    const url = `${this.apiUrl}messages`;
    const headers = this.getHeaders();
    const body = {
      receiverId: receiverId,
      content: content,
    };

    return this.http.post(url, body, { headers });
  }

  updateMessageContent(messageId: number, content: string): Observable<any> {
    const url = `${this.apiUrl}messages/${messageId}`;
    const headers = this.getHeaders();
    const body = { content };
  
    return this.http.put(url, body, { headers });
  }

  deleteMessage(messageId: number): Observable<any> {
    const url = `${this.apiUrl}messages/${messageId}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers });
  }
 

  fetchLogs(startTime?: Date | null, endTime?: Date | null): Observable<any> {
    const url = `${this.apiUrl}log`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    let params = new HttpParams();

    if (startTime !== null) {
      params = params.set('startTime', this.formatDate(startTime!));
    }

    if (endTime !== null) {
      params = params.set('endTime', this.formatDate(endTime!));
    }

    return this.http.get<any>(url, { headers, params });
  }
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }
}
  
