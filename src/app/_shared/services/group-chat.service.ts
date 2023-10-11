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

  /**
   * Sends a request to remove a member from a group, specified by their ID.
   * The request is made to the server using a POST request, with the member's ID passed as a query parameter.
   * Returns an observable for handling the result of the removal operation.
   */
  removeMemberFromGroup(groupId: string, memberId: string): Observable<any> {
    const url = `${this.apiUrl}${groupId}/remove-member`;
    const params = { memberId: memberId };
    return this.http.post(url, null, { params: params });
  }

  updateGroupName(groupId: string, newName: string): Observable<any> {
    const url = `${this.apiUrl}${groupId}/edit-group-name`;
    const params = { newName: newName };
    return this.http.put(url, null, { params: params });
  }

  deleteGroup(groupId: string): Observable<any> {
    const url = `${this.apiUrl}${groupId}/delete-group`;
    return this.http.delete(url);
  }
}
