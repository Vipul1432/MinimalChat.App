import { Component, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgToastService } from 'ng-angular-popup';
import { EditMessageDialogComponent } from 'src/app/_helpers/edit-message-dialog/edit-message-dialog.component';
import { UserChat } from 'src/app/_shared/models/UserChat';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { ChatService } from 'src/app/_shared/services/chat.service';
import Swal  from 'sweetalert2';


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
      }
    }
  }
  
  @HostListener('window:scroll', ['$event'])
  checkScroll(event: Event) {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    if (scrollPosition <= 0 && !this.isLoading) {
      this.isLoading = true;
      this.fetchUserChat(this.topTimestamp);
    }
  }

  private fetchUserChat(topTimestamp: Date) {
    this.chatService
      .getUserChat(this.userId, topTimestamp, null, null)
      .subscribe((messages: any) => {
        if (topTimestamp === null) {
          this.userChat = messages.data;
        } else {
          // Append the new messages to the existing ones
          this.userChat = [...messages.data, ...this.userChat];
        }

        // Update the top timestamp
        if (this.userChat.length > 0) {
          this.topTimestamp = this.userChat[0].timestamp;
        }
      });
  }

  isSender(message: UserChat): boolean {
    return message.senderId === this.userId;
  }

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
            console.error('Failed to send message:', response.error);
          }
        });
    }
  }

  // Edit Message
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

  showContextMenu(message: UserChat) {
    this.selectedMessage = message;   
  }

  @ViewChild('messageContextMenu') messageContextMenu!: MatMenuTrigger;

  // Save the edited message content
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
        (error) => {
          console.error('Failed to update message content:', error);
        }
      );
  }

  deleteMessage(message: UserChat) {
    console.log(message.content);  
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger me-2'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("yes!" + message.id);
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
        )
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your message is safe :)',
          'error'
        )
      }
    })
  }
  
}
