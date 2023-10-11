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

  createGroup(name: string, members: string[]): Observable<any> {
    const url = `${this.apiUrl}create-group`;
    const body = {
      name: name,
      members: members,
    };

    return this.http.post(url, body);
  }

  addMembersToGroup(groupId: string, memberIds: string[]): Observable<any> {
    const url = `${this.apiUrl}${groupId}/add-member`;
    return this.http.post(url, memberIds);
  }
}
