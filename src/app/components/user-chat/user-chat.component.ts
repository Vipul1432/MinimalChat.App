import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  Input,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgToastService } from 'ng-angular-popup';
import { AddMembersDialogComponent } from 'src/app/_helpers/add-members-dialog/add-members-dialog.component';
import { EditMessageDialogComponent } from 'src/app/_helpers/edit-message-dialog/edit-message-dialog.component';
import { GroupMembers } from 'src/app/_shared/models/GroupMembers';
import { UserChat } from 'src/app/_shared/models/UserChat';
import { User } from 'src/app/_shared/models/User';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { ChatService } from 'src/app/_shared/services/chat.service';
import Swal from 'sweetalert2';
import { GroupChatService } from 'src/app/_shared/services/group-chat.service';
import { RemoveUserDialogComponent } from 'src/app/_helpers/remove-user-dialog/remove-user-dialog.component';
import { EditGroupNameDialogComponent } from 'src/app/_helpers/edit-group-name-dialog/edit-group-name-dialog.component';
import { MakeUserAdminDialogComponent } from 'src/app/_helpers/make-user-admin-dialog/make-user-admin-dialog.component';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.css'],
})
export class UserChatComponent implements AfterViewChecked {
  userChat: UserChat[] = [];
  topTimestamp: Date = new Date();
  @Input() userId: string = '';
  @Input() name: string = '';
  topPosToStartShowing = 100;
  isLoading!: boolean;
  selectedUserName: string = '';
  currentUserName: string | null = '';
  currentGroupUserName: string | null = '';
  currentUserId: string | null = '';
  messageInput: string = '';
  selectedMessage: UserChat | null = null;
  groupmembers: GroupMembers[] = [];
  isReceiverIdNull: boolean = false;
  groupUsers: string[] = [];
  isCurrentUserAdminInGroup: boolean = false;
  isGroup: boolean = false;
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  externalLinkTarget: string = 'blank';

  constructor(
    private chatService: ChatService,
    private authService: AuthService,
    private dialog: MatDialog,
    private toasterService: NgToastService,
    private groupChatService: GroupChatService
  ) {
    this.currentUserName = this.authService.getUserName();
    this.currentUserId = this.authService.getCurrentUserId();
  }

  /**
   * Initializes the component/module, checking and establishing a chat connection if needed.
   * Sets up an event handler for receiving chat messages and updates the user chat data.
   */
  ngOnInit(): void {
    if (this.chatService.isConnectionDisconnected()) {
      this.chatService.startConnection();
    }

    this.chatService.hubConnection.on(
      'ReceiveMessage',
      (id: string, message: string) => {
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
    );
  }

  /**
   * Lifecycle hook called after the view has been initialized.
   * Automatically scrolls the chat messages container to the bottom.
   */
  ngAfterViewChecked() {
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
    this.scrollToBottom();
    if (changes['userId'] && !changes['userId'].firstChange) {
      if (changes['name'] && !changes['name'].firstChange) {
        this.selectedUserName = this.name;
      }
      // Fetch user chat data using the new userId
      if (this.userId) {
        this.fetchChatwithGroupMembers();
      }
    }
  }

  /**
   * Scrolls to the bottom of the message container element.
   */
  private scrollToBottom() {
    if (this.messageContainerRef) {
      const container = this.messageContainerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
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

    if (scrollPosition <= 0 || (scrollPosition <= 100 && !this.isLoading)) {
      this.isLoading = true;
      // this.fetchUserChat(this.topTimestamp);
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
          if (messages.data && Array.isArray(messages.data)) {
            if (
              topTimestamp === null &&
              messages.message == 'No more conversation found.'
            ) {
              this.userChat = messages.data;
              this.toasterService.success({
                detail: 'SUCCESS',
                summary: '20 more messages retrieved successfully!',
                duration: 5000,
              });
            } else {
              // Append the new messages to the existing ones
              this.userChat = [...messages.data, ...this.userChat];
              console.log('hi');
            }
          }

          // Update the top timestamp
          if (this.userChat.length > 0) {
            this.topTimestamp = this.userChat[0].timestamp;
          }
        },
        (error: any) => {
          if (error.status === 400) {
            console.log(`error message` + error.error.message);
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
    if (message.receiverId == null) {
      this.isReceiverIdNull = true;
    } else {
      this.isReceiverIdNull = false;
    }
    return message.senderId === this.currentUserId;
  }

  /**
   * Sends a message in the chat.
   */
  sendMessage() {
    const content = this.messageInput.trim();
    if (this.selectedFile != null) {
      this.chatService
        .uploadFile(this.userId, this.selectedFile)
        .subscribe((response: any) => {
          if (response.filePath) {
            this.chatService
              .getUserChat(this.userId, null, null, null)
              .subscribe((messages: any) => {
                this.userChat = messages.data || [];
                this.topTimestamp =
                  this.userChat.length > 0
                    ? this.userChat[0].timestamp
                    : new Date();
                this.selectedFile = null;
                this.selectedFileName = '';
              });
          } else {
            console.log('error');
          }
        });
    }

    if (content.trim() !== '') {
      // Check if the content is not empty or whitespace
      this.chatService
        .sendMessage(this.userId, content)
        .subscribe((response: any) => {
          if (response.statusCode === 200) {
            console.log('message content' + this.userId);
            this.chatService
              .getUserChat(this.userId, null, null, null)
              .subscribe((messages: any) => {
                console.log('message content' + content);
                this.userChat = messages.data || [];
                this.topTimestamp =
                  this.userChat.length > 0
                    ? this.userChat[0].timestamp
                    : new Date();
                this.messageInput = '';
              });
          } else {
            console.log('error');
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
    console.log('hi' + message.id);

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

  /**
   * Opens a dialog to add members to a group, handles the dialog actions, and updates the chat with group members.
   * - Opens a dialog to select users to add to the group.
   * - Handles the result from the dialog, sending selected user IDs to the server.
   * - Updates the chat with group members after adding new members.
   * - Displays success or error messages to the user using a toaster service.
   */
  addMembers() {
    // Open the dialog and pass data to it (e.g., groupUsers)
    const dialogRef = this.dialog.open(AddMembersDialogComponent, {
      data: {
        groupUsers: this.groupmembers,
      },
    });

    // Handle dialog actions as needed
    dialogRef.afterClosed().subscribe(
      (result: User[]) => {
        const userIds: string[] = result.map((user) => user.id);
        this.groupChatService
          .addMembersToGroup(this.userId, userIds)
          .subscribe((response) => {
            this.fetchChatwithGroupMembers();
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: response.message,
              duration: 5000,
            });
          });
      },
      (error) => {
        this.toasterService.error({
          detail: 'ERROR',
          summary: 'Error while adding members to the group:' + error,
          sticky: true,
        });
      }
    );
  }

  /**
   * Fetches chat data for the current user with group members and updates related properties.
   * - Retrieves user chat messages.
   * - Populates the group members and group user names.
   * - Determines if the current user is an admin in the group.
   * - Sets the top timestamp for chat messages.
   */
  private fetchChatwithGroupMembers() {
    this.chatService.getUserChat(this.userId, null, null, null).subscribe(
      (messages: any) => {
        console.log(messages);

        if (messages) {
          if (
            messages.message == 'No more conversation found.' &&
            messages.data != null
          ) {
            this.isGroup = true;
            this.userChat = [];
            this.groupmembers = messages.data;
            this.groupUsers = this.groupmembers.map(
              (member) => member.userName
            );
          } else {
            console.log('test1' + messages.data);

            this.userChat = messages.data || [];
            this.isGroup = false;
          }
          if (messages.data[0].users != null) {
            this.groupmembers = messages.data[0].users;
            this.groupUsers = this.groupmembers.map(
              (member) => member.userName
            );
          }
          const filteredMembers = this.groupmembers.filter(
            (member: GroupMembers) => member.userId === this.currentUserId
          );
          this.isCurrentUserAdminInGroup = filteredMembers.some(
            (member) => member.isAdmin
          );
          this.topTimestamp =
            this.userChat.length > 0 ? this.userChat[0].timestamp : new Date();
        } else {
          console.log('value not getting');
        }
      },
      (error) => {
        console.log(error);
        this.isGroup = false;
      }
    );
    this.scrollToBottom();
  }

  /**
   * Opens a confirmation dialog to remove a member from the group.
   * Upon confirmation, sends a request to the groupChatService to remove the specified member from the group.
   * If successful, triggers a chat data update by calling `fetchChatwithGroupMembers`.
   * Handles errors by displaying an error notification using `toasterService`.
   */
  removeMember() {
    const dialogRef = this.dialog.open(RemoveUserDialogComponent, {
      data: {
        groupUsers: this.groupmembers,
      },
    });

    dialogRef.afterClosed().subscribe(
      (memberId) => {
        this.groupChatService
          .removeMemberFromGroup(this.userId, memberId)
          .subscribe((result: any) => {
            this.fetchChatwithGroupMembers();
          });
      },
      (error) => {
        this.toasterService.error({
          detail: 'ERROR',
          summary: 'Error while removing members from the group:' + error,
          sticky: true,
        });
      }
    );
  }

  /**
   * Opens a dialog to edit the group name and updates it if a new name is provided.
   * @returns void
   */
  editGroupName() {
    console.log(this.selectedUserName);

    const dialogRef = this.dialog.open(EditGroupNameDialogComponent, {
      data: {
        groupname: this.selectedUserName,
      },
    });
    dialogRef.afterClosed().subscribe(
      (name) => {
        if (name != undefined && name != '')
          this.groupChatService
            .updateGroupName(this.userId, name)
            .subscribe((result: any) => {
              this.selectedUserName = name;
              this.fetchChatwithGroupMembers();
            });
        this.toasterService.success({
          detail: 'SUCCESS',
          summary: `Group name updated successfully!`,
          duration: 5000,
        });
      },
      (error) => {
        this.toasterService.error({
          detail: 'ERROR',
          summary: 'Error while removing members from the group:' + error,
          sticky: true,
        });
      }
    );
  }

  /**
   * Initiates a confirmation dialog to delete the group. Performs group deletion if confirmed.
   * @returns void
   */
  deleteGroup() {
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
          swalWithBootstrapButtons.fire(
            'Deleted!',
            `${this.selectedUserName} has been deleted.`,
            'success'
          );
          this.groupChatService.deleteGroup(this.userId).subscribe((data) => {
            console.log(data);
          });
          location.reload();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            `${this.selectedUserName} is safe :)`,
            'error'
          );
        }
      });
  }

  /**
   * Opens a dialog to make a group member an admin within the group.
   * @returns void
   */
  makeMemberAdmin() {
    const dialogRef = this.dialog.open(MakeUserAdminDialogComponent, {
      data: {
        groupUsers: this.groupmembers.filter((member) => !member.isAdmin),
      },
    });

    dialogRef.afterClosed().subscribe(
      (user) => {
        this.groupChatService
          .makeUserAdmin(this.userId, user.userId)
          .subscribe((result: any) => {
            this.fetchChatwithGroupMembers();
          });
        this.toasterService.success({
          detail: 'SUCCESS',
          summary: `${user.userName} is now Admin`,
          duration: 5000,
        });
      },
      (error) => {
        this.toasterService.error({
          detail: 'ERROR',
          summary: 'Error while removing members from the group:' + error,
          sticky: true,
        });
      }
    );
  }

  /**
   * Retrieves and returns the username of a selected user based on the message's senderId.
   * @param messages - UserChat object containing the message details.
   * @returns The username of the sender if available, or the current selected username.
   */
  getSelectedUserName(messages: UserChat): string {
    if (messages.receiverId == null) {
      for (const groupmember of this.groupmembers) {
        if (groupmember.userId === messages.senderId) {
          return groupmember.userName;
        }
      }
    }
    return this.selectedUserName;
  }

  /**
   * Creates an input element for selecting a file and updates component properties with the selected file's information.
   */
  attachFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '*/*';

    fileInput.addEventListener('change', (event) => {
      const inputElement = event.target as HTMLInputElement;
      const selectedFile = inputElement.files?.[0];
      if (selectedFile) {
        this.selectedFile = selectedFile;
        this.selectedFileName = selectedFile.name;
      }
    });

    fileInput.click();
  }

  /**
   * Checks if a given file name has an image extension.
   * @param fileName - The name of the file to check.
   * @returns True if the file is an image, otherwise false.
   */
  isImageFile(fileName: string): boolean {
    const extensions = ['.jpg', '.jpeg', '.png'];
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    return extensions.includes(ext);
  }

  /**
   * Initiates the download of a file associated with a chat message and displays a success notification.
   * @param message - The chat message containing file details.
   */
  downloadFile(message: UserChat) {
    this.chatService.downloadFile(message.id, message.fileName);
    this.toasterService.success({
      detail: 'SUCCESS',
      summary: 'File downloaded successfully',
      duration: 3000,
    });
  }
}
