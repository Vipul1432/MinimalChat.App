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

  /**
 * Retrieves a JSON Web Token (JWT) from local storage.
 *
 * @returns The JWT token as a string if it's stored in local storage, or null if not found.
 */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
 * Creates and returns HttpHeaders with the necessary authentication headers.
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
 * Retrieves user chat messages from the API based on specified parameters.
 *
 * @param UserId - The ID of the user for whom to retrieve chat messages.
 * @param Before - Optional. A date used to filter messages before a certain date.
 * @param count - Optional. The maximum number of messages to retrieve.
 * @param sortOrder - Optional. The sort order of the messages.
 * @returns An Observable containing an array of UserChat objects representing chat messages.
 */
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

  /**
 * Sends a chat message to a specified receiver via a POST request to the API.
 *
 * @param receiverId - The ID of the message receiver.
 * @param content - The content of the chat message.
 * @returns An Observable representing the result of the message sending process.
 *          Subscribers can handle the response asynchronously.
 */
  sendMessage(receiverId: string, content: string): Observable<any> {
    const url = `${this.apiUrl}messages`;
    const headers = this.getHeaders();
    const body = {
      receiverId: receiverId,
      content: content,
    };

    return this.http.post(url, body, { headers });
  }

  /**
 * Updates the content of a chat message via a PUT request to the API.
 *
 * @param messageId - The ID of the message to be updated.
 * @param content - The new content for the chat message.
 * @returns An Observable representing the result of the message update process.
 *          Subscribers can handle the response asynchronously.
 */
  updateMessageContent(messageId: number, content: string): Observable<any> {
    const url = `${this.apiUrl}messages/${messageId}`;
    const headers = this.getHeaders();
    const body = { content };
  
    return this.http.put(url, body, { headers });
  }

  /**
 * Deletes a chat message via a DELETE request to the API.
 *
 * @param messageId - The ID of the message to be deleted.
 * @returns An Observable representing the result of the message deletion process.
 *          Subscribers can handle the response asynchronously.
 */
  deleteMessage(messageId: number): Observable<any> {
    const url = `${this.apiUrl}messages/${messageId}`;
    const headers = this.getHeaders();

    return this.http.delete(url, { headers });
  }

  /**
 * Retrieves log data from the API within a specified time range.
 *
 * @param startTime - Optional. The start time for filtering log entries.
 * @param endTime - Optional. The end time for filtering log entries.
 * @returns An Observable containing log data based on the specified time range.
 *          Subscribers can handle the response asynchronously.
 */
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

  /**
 * Formats a JavaScript Date object into a string representation with a specific format.
 *
 * @param date - The Date object to be formatted.
 * @returns A formatted string representation of the date and time.
 */
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
  
