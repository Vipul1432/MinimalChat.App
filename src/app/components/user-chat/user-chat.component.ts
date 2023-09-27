import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgToastService } from 'ng-angular-popup';
import { EditMessageDialogComponent } from 'src/app/_helpers/edit-message-dialog/edit-message-dialog.component';
import { UserChat } from 'src/app/_shared/models/UserChat';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { ChatService } from 'src/app/_shared/services/chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css'],
})
export class UserChatComponent implements OnChanges {
  userChat: UserChat[] = [];
  topTimestamp: Date = new Date();
  @Input() userId: string = '';
  @Input() name: string = '';
  topPosToStartShowing = 100;
  isLoading!: boolean;
  selectedUserName: string = '';
  currentUserName: string | null = '';
  messageInput: string = '';
  selectedMessage: UserChat | null = null;

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toasterService: NgToastService
  ) {
    this.currentUserName = this.authService.getUserName();
  }

  /**
   * Initializes the component/module, checking and establishing a chat connection if needed.
   * Sets up an event handler for receiving chat messages and updates the user chat data.
   */
  ngOnInit(): void {
    if (this.chatService.isConnectionDisconnected()) {
      this.chatService.startConnection();
    }

    this.chatService.hubConnection.on('ReceiveMessage', (message: string) => {
      // Handle incoming message, e.g., display it in the chat window
      this.chatService
        .getUserChat(this.userId, null, null, null)
        .subscribe((messages: any) => {
          this.userChat = messages.data || [];
          this.topTimestamp =
            this.userChat.length > 0 ? this.userChat[0].timestamp : new Date();
        });
    });
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
      this.chatService.searchMessages(keyword, this.userId).subscribe(
        (response: any) => {
          this.userChat = response.messages;
        },
        (error) => {
          this.userChat = [];
          this.toasterService.warning({
            detail: 'WARN',
            summary: error.error.message,
            duration: 3000,
            position: 'bottomRight',
          });
          console.clear();
        }
      );
    } else {
      this.chatService
        .getUserChat(this.userId, null, null, null)
        .subscribe((messages: any) => {
          this.userChat = messages.data || [];
          this.topTimestamp =
            this.userChat.length > 0 ? this.userChat[0].timestamp : new Date();
        });
    }
  }

  /**
   * Lifecycle hook called after the view has been initialized.
   * Automatically scrolls the chat messages container to the bottom.
   */
  ngAfterViewInit() {
    this.scrollToBottom();
  }

  @ViewChild('messageContainerRef', { static: false })
  messageContainerRef!: ElementRef;

  /**
   * Lifecycle hook that gets called when there are changes to input properties.
   *
   * @param changes - An object containing changes to input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['userId'] && !changes['userId'].firstChange) {
      if (changes['name'] && !changes['name'].firstChange) {
        this.selectedUserName = this.name;
      }
      // Fetch user chat data using the new userId
      if (this.userId) {
        this.chatService
          .getUserChat(this.userId, null, null, null)
          .subscribe((messages: any) => {
            this.userChat = messages.data || [];
            this.topTimestamp =
              this.userChat.length > 0
                ? this.userChat[0].timestamp
                : new Date();
          });
        this.scrollToBottom();
      }
    }
  }

  /**
   * Scrolls to the bottom of the message container element.
   */
  private scrollToBottom() {
    if (this.messageContainerRef) {
      this.messageContainerRef.nativeElement.scrollTop =
        this.messageContainerRef.nativeElement.scrollHeight;
    }
  }

  /**
   * Checks the scroll position and triggers an action if specific conditions are met.
   *
   * @param event - The scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  checkScroll(event: Event) {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollPosition <= 0 || (scrollPosition <= 25 && !this.isLoading)) {
      this.isLoading = true;
      this.fetchUserChat(this.topTimestamp);
    }
  }

  /**
   * Fetches user chat data based on the provided topTimestamp and updates the userChat array.
   *
   * @param topTimestamp - The timestamp to fetch chat messages from (null for initial load).
   */
  private fetchUserChat(topTimestamp: Date) {
    this.chatService
      .getUserChat(this.userId, topTimestamp, null, null)
      .subscribe(
        (messages: any) => {
          if (topTimestamp === null) {
            this.userChat = messages.data;
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: '20 more messagse retrieve successfully!',
              duration: 5000,
            });
          } else {
            // Append the new messages to the existing ones
            this.userChat = [...messages.data, ...this.userChat];
          }

          // Update the top timestamp
          if (this.userChat.length > 0) {
            this.topTimestamp = this.userChat[0].timestamp;
          }
        },
        (error: any) => {
          if (error.status === 400) {
          }
        }
      );
  }

  /**
   * Checks if the given UserChat message is sent by the currently logged-in user.
   *
   * @param message - The UserChat message object to check.
   * @returns True if the message is sent by the user, false otherwise.
   */
  isSender(message: UserChat): boolean {
    return message.senderId === this.userId;
  }

  /**
   * Sends a message in the chat.
   */
  sendMessage() {
    const content = this.messageInput.trim();
    if (content.trim() !== '') {
      // Check if the content is not empty or whitespace
      this.chatService
        .sendMessage(this.userId, content)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            this.chatService
              .getUserChat(this.userId, null, null, null)
              .subscribe((messages: any) => {
                this.userChat = messages.data || [];
                this.topTimestamp =
                  this.userChat.length > 0
                    ? this.userChat[0].timestamp
                    : new Date();
                this.messageInput = '';
              });
          } else {
          }
        });
    }
  }

  /**
   * Opens a dialog for editing a user's chat message and saves the edited message if changes are made.
   *
   * @param message The UserChat object representing the message to be edited.
   *                If provided, the dialog for editing is opened.
   *                If not provided or falsy, the function does nothing.
   **/
  editMessage(message: UserChat) {
    if (message) {
      // Open the dialog
      const dialogRef = this.dialog.open(EditMessageDialogComponent, {
        width: '300px',
        data: { message },
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.saveEditMessage(result);
        }
      });
    }
  }

  /**
   * Displays a context menu or options for the given UserChat message.
   *
   * @param message - The UserChat message for which to show the context menu.
   */
  showContextMenu(message: UserChat) {
    this.selectedMessage = message;
  }

  @ViewChild('messageContextMenu') messageContextMenu!: MatMenuTrigger;

  /**
   * Saves the edited content of a chat message.
   *
   * @param result - The UserChat message with edited content.
   */
  saveEditMessage(result: UserChat) {
    this.chatService
      .updateMessageContent(result.id, result.editedContent!)
      .subscribe(
        (response) => {
          if (response.statusCode === 200) {
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: 'Message edited successfully!',
              duration: 5000,
            });
            this.chatService
              .getUserChat(this.userId, null, null, null)
              .subscribe((messages: any) => {
                this.userChat = messages.data || [];
                this.topTimestamp =
                  this.userChat.length > 0
                    ? this.userChat[0].timestamp
                    : new Date();
              });
          }
        },
        (error) => {}
      );
  }

  /**
   * Handles the deletion of a chat message.
   *
   * @param message - The UserChat message to be deleted.
   */
  deleteMessage(message: UserChat) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.chatService.deleteMessage(message.id).subscribe(() => {
            this.chatService
              .getUserChat(this.userId, null, null, null)
              .subscribe((messages: any) => {
                this.userChat = messages.data || [];
                this.topTimestamp =
                  this.userChat.length > 0
                    ? this.userChat[0].timestamp
                    : new Date();
              });
          });
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your message has been deleted.',
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your message is safe :)',
            'error'
          );
        }
      });
  }
}
