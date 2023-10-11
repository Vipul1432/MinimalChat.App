import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Creates a new group with the given name and initial members.
   * - Sends a POST request to the API to create a group.
   * - Provides the group name and initial members in the request body.
   * - Returns an observable with the API response.
   */
  createGroup(name: string, members: string[]): Observable<any> {
    const url = `${this.apiUrl}create-group`;
    const body = {
      name: name,
      members: members,
    };

    return this.http.post(url, body);
  }

  /**
   * Adds members to an existing group.
   * - Sends a POST request to the API to add members to a specific group.
   * - Provides the group ID and member IDs in the request.
   * - Returns an observable with the API response.
   */
  addMembersToGroup(groupId: string, memberIds: string[]): Observable<any> {
    const url = `${this.apiUrl}${groupId}/add-member`;
    return this.http.post(url, memberIds);
  }
}
