import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { UserChat } from '../models/UserChat';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;
  hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {
    if (
      !this.hubConnection ||
      this.hubConnection.state === signalR.HubConnectionState.Disconnected
    ) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:7038/chatHub')
        .withAutomaticReconnect()
        .build();
      this.startSignalRConnection();
    }
  }

  // Check if the HubConnection is in the 'Disconnected' state.
  isConnectionDisconnected(): boolean {
    return this.hubConnection.state === signalR.HubConnectionState.Disconnected;
  }

  /**
   * Initiates a connection to the SignalR hub for real-time communication.
   * Logs the success or failure of the SignalR connection attempt.
   */
  private startSignalRConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('SignalR connection started');
      })
      .catch((err) => {
        console.error('Error while starting SignalR connection: ' + err);
      });
  }

  /**
   * Initiates a connection to the WebSocket hub for real-time communication.
   * Logs the success or failure of the connection attempt.
   */
  startConnection(): void {
    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started');
      })
      .catch((err) => {
        console.error('Error while starting connection: ' + err);
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
    return this.http.get<UserChat[]>(url, { params });
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
    const body = {
      receiverId: receiverId,
      content: content,
    };

    return this.http.post(url, body);
  }

  /**
   * Uploads a file to a specified recipient or group chat.
   * @param receiverId - The ID of the recipient or group to which the file is being sent.
   * @param file - The file to be uploaded.
   * @returns An Observable that represents the HTTP POST request for file upload.
   */
  uploadFile(receiverId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.apiUrl}messages/upload/${receiverId}`;

    return this.http.post(url, formData);
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
    const body = { content };

    return this.http.put(url, body);
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
    return this.http.delete(url);
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

    let params = new HttpParams();

    if (startTime !== null) {
      params = params.set('startTime', this.formatDate(startTime!));
    }

    if (endTime !== null) {
      params = params.set('endTime', this.formatDate(endTime!));
    }

    return this.http.get<any>(url, { params });
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

  /**
   * Searches for chat messages based on a query and user ID.
   *
   * @param query - The search query string.
   * @param userId - The ID of the user for whom to search messages.
   * @returns An Observable containing an array of UserChat objects representing matching chat messages.
   */
  searchMessages(query: string): Observable<UserChat[]> {
    const url = `${this.apiUrl}conversation/search`;
    const params = new HttpParams().set('query', query);

    return this.http.get<UserChat[]>(url, { params });
  }

  /**
   * Downloads a file associated with a specific message by its ID and file name.
   * @param messageId - The ID of the message containing the file to be downloaded.
   * @param fileName - The name of the file to be downloaded.
   */
  downloadFile(messageId: number, fileName: string): void {
    this.http
      .get(`${this.apiUrl}download/${messageId}`, { responseType: 'blob' })
      .subscribe((response: any) => {
        this.handleFileDownload(response, fileName);
      });
  }

  /**
   * Handles the download of a file by creating a temporary URL and initiating the download.
   * @param blob - The Blob object representing the file content.
   * @param fileName - The name of the file to be downloaded.
   */
  private handleFileDownload(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
