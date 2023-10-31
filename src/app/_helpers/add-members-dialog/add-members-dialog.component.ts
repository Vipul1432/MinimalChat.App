import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { User } from 'src/app/_shared/models/User';
import { UserService } from 'src/app/_shared/services/user.service';
import { HistoryOptionsDialogComponent } from '../history-options-dialog/history-options-dialog.component';

@Component({
  selector: 'app-add-members-dialog',
  templateUrl: 'add-members-dialog.component.html',
})
export class AddMembersDialogComponent {
  allusers: any[] = [];
  selectedUser: any;
  selectedOption: any;
  constructor(
    public dialogRef: MatDialogRef<AddMembersDialogComponent>,
    private userService: UserService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userService.getAllUsers(true).subscribe((users: any) => {
      this.allusers = users.data.map((user: User) => ({
        ...user,
        isSelected: false,
      }));
    });
  }
  groupUsers = this.data.groupUsers;

  availableUsers = this.data.groupUsers;
  isUserInGroup(user: User): boolean {
    const isUserInGroup = this.groupUsers.some(
      (groupUser: any) => groupUser.userId === user.id
    );
    return !isUserInGroup;
  }

  openHistoryOptionsDialog(user: any): void {
    console.log(this.groupUsers);

    this.selectedUser = user;
    const dialogRef = this.dialog.open(HistoryOptionsDialogComponent, {
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.selectedOption = result;
        this.allusers = this.selectedUser;
      }
    });
  }

  /**
   * Handles the submission action in the dialog.
   * - Collects the selected users from the list.
   * - Closes the dialog and provides the selected users to the caller.
   */
  onSubmit() {
    // this.dialogRef.close({
    //   addUser: this.selectedUser,
    //   historyOption: this.selectedOption,
    // });
  }

  /**
   * Handles the action of closing the dialog without saving.
   * - Closes the dialog without returning any data.
   */
  onClose() {
    this.dialogRef.close();
  }
}
