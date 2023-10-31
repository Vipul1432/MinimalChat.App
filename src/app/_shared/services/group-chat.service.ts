import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddGroupMember } from '../models/AddGroupMember';

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
  addMembersToGroup(
    groupId: string,
    addGroupMemberDto: AddGroupMember
  ): Observable<any> {
    const url = `${this.apiUrl}${groupId}/add-member`;
    return this.http.post(url, addGroupMemberDto);
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

  /**
   * Updates the name of a group with the specified groupId to the provided newName.
   * @param groupId - The unique identifier of the group to be updated.
   * @param newName - The new name for the group.
   * @returns An Observable that represents the result of the update operation.
   */
  updateGroupName(groupId: string, newName: string): Observable<any> {
    const url = `${this.apiUrl}${groupId}/edit-group-name`;
    const params = { newName: newName };
    return this.http.put(url, null, { params: params });
  }

  /**
   * Deletes the group with the specified groupId.
   * @param groupId - The unique identifier of the group to be deleted.
   * @returns An Observable that represents the result of the deletion operation.
   */
  deleteGroup(groupId: string): Observable<any> {
    const url = `${this.apiUrl}${groupId}/delete-group`;
    return this.http.delete(url);
  }

  /**
   * Makes a user an admin within the specified group.
   * @param groupId - The unique identifier of the group where the user will become an admin.
   * @param userId - The unique identifier of the user to be made an admin.
   * @returns An Observable that represents the result of making the user an admin.
   */
  makeUserAdmin(groupId: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}make-member-admin`;
    const params = { groupId: groupId, memberId: userId };
    return this.http.put(url, null, { params: params });
  }
}
