import { Component, ViewChild } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { UserChat } from 'src/app/_shared/models/UserChat';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { ChatService } from 'src/app/_shared/services/chat.service';

@Component({
  selector: 'app-chat-dashboard',
  templateUrl: './chat-dashboard.component.html',
  styleUrls: ['./chat-dashboard.component.css'],
})
export class ChatDashboardComponent {
  showUserList = true;
  selectedUserId: string = '';
  selectedUserName: string = '';
  currentUserId: string | null = null;
  userChat: UserChat[] = [];
  showSearchResults: boolean = false;
  @ViewChild('searchInput') searchInput: any;

  constructor(
    private chatService: ChatService,
    private toasterService: NgToastService,
    private authService: AuthService
  ) {
    this.GetCurrentUserId();
  }

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

  /**
   * Searches for chat messages based on a keyword and updates the user's chat messages accordingly.
   * If a valid keyword is provided, it filters messages containing the keyword;
   * otherwise, it retrieves all user chat messages.
   *
   * @param keyword - The keyword to search for in chat messages.
   */
  searchMessages(keyword: string): void {
    if (keyword !== null && keyword.length > 0 && keyword !== '') {
      this.chatService.searchMessages(keyword).subscribe(
        (response: any) => {
          this.userChat = response.messages;
          this.showSearchResults = true;
          this.showUserList = false;
        },
        (error) => {
          this.userChat = [];
          this.toasterService.warning({
            detail: 'WARN',
            summary: error.error.message,
            duration: 3000,
            position: 'bottomRight',
          });
        }
      );
    } else if (keyword === '') {
      this.userChat = [];
    } else {
      this.chatService
        .getUserChat(this.selectedUserId, null, null, null)
        .subscribe((messages: any) => {
          this.userChat = messages.data || [];
        });
    }
  }

  /**
   * Closes the search results, restores the user list, and clears the search input field if it exists.
   */
  closeSearchResults() {
    this.showSearchResults = false;
    this.showUserList = true;
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  /**
   * Retrieves the current user's ID using the authService.
   */
  GetCurrentUserId() {
    this.currentUserId = this.authService.getCurrentUserId();
  }
}
