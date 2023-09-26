import { Component } from '@angular/core';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css']
})
export class ChatDashboardComponent {
  showUserList = true;
  selectedUserId: string = '';
  selectedUserName: string = '';

  /**
 * Handles the user interaction when a user is clicked or selected.
 *
 * @param userId - The ID of the selected user.
 * @param name - The name of the selected user.
 */
  onUserClicked(userId: string, name: string) {
    this.selectedUserId = userId;
    this.selectedUserName = name;
  }
}
