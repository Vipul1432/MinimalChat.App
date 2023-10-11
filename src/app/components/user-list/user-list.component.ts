import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/_shared/models/User';
import { UserService } from 'src/app/_shared/services/user.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialog } from '@angular/material/dialog';
import { CreateGroupDialogComponent } from 'src/app/_helpers/create-group-dialog/create-group-dialog/create-group-dialog.component';
import { GroupChatService } from 'src/app/_shared/services/group-chat.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() userClicked: EventEmitter<{ userId: string; name: string }> =
    new EventEmitter<{ userId: string; name: string }>();

  userBackgroundColors: string[] = [];
  colors: string[] = [
    '#000000',
    '#e91e63',
    '#009688',
    '#ff9800',
    '#673ab7',
    '#ff5722',
  ];
  i: number = 0;

  constructor(
    private userService: UserService,
    private toasterService: NgToastService,
    private dialog: MatDialog,
    private groupChatService: GroupChatService
  ) {}

  /**
   * Angular lifecycle hook called when the component is initialized.
   * Fetches a list of users and performs necessary operations.
   */
  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    // Fetch all users
    this.userService.getAllUsers().subscribe(
      (response: any) => {
        if (response.statusCode === 200) {
          this.users = response.data;
          this.generateRandomNumber(this.users.length);
          this.users.forEach(() => {
            this.userBackgroundColors = this.generateRandomColors(
              this.users.length
            );
          });
        } else {
          this.toasterService.error({
            detail: 'ERROR',
            summary: 'Failed to fetch users',
            sticky: true,
          });
        }
      },
      (error) => {
        console.error('Failed to fetch users:', error);
        this.toasterService.error({
          detail: 'ERROR',
          summary: 'Failed to fetch users',
          sticky: true,
        });
      }
    );
  }

  /**
   * Generates an array of random colors.
   *
   * @param count - The number of random colors to generate.
   * @returns An array of random color strings.
   */
  generateRandomColors(count: number): string[] {
    const randomColors: string[] = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * this.colors.length);
      randomColors.push(this.colors[randomIndex]);
    }
    return randomColors;
  }

  /**
   * Generates a random number between 0 (inclusive) and the specified maximum value (exclusive).
   *
   * @param max - The maximum value (exclusive) for the random number.
   * @returns A random number.
   */
  generateRandomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }

  /**
   * Emits a userClicked event when a user is clicked or selected.
   *
   * @param userId - The ID of the clicked user.
   * @param name - The name of the clicked user.
   */
  onUserClick(userId: string, name: string): void {
    this.userClicked.emit({ userId, name });
  }
  createGroup() {
    const usersWithoutGroup = this.users.filter((user) => user.email !== null);
    const dialogRef = this.dialog.open(CreateGroupDialogComponent, {
      width: '400px', // Set the desired width
      data: {
        users: usersWithoutGroup, // Pass the list of users to the dialog component
      },
    });

    // Subscribe to the dialog's result
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { groupName, selectedUsers } = result;
        this.groupChatService.createGroup(groupName, selectedUsers).subscribe(
          (response) => {
            console.log(response);
            this.getAllUsers();
            this.toasterService.success({
              detail: 'SUCCESS',
              summary: response.data.name + ' Group created successfully',
              duration: 5000,
            });
          },
          (error) => {
            // Handle an error response from the service (e.g., display an error message)
            console.error('Error creating group:', error);
            this.toasterService.error({
              detail: 'ERROR',
              summary: 'Failed to create group',
              sticky: true,
            });
          }
        );
      }
    });
  }
}
