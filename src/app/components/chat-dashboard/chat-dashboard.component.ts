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

  onUserClicked(userId: string, name: string) {
    this.selectedUserId = userId;
    this.selectedUserName = name;
  }
}
