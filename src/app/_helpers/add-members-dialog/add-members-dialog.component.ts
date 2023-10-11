import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/_shared/models/User';
import { UserService } from 'src/app/_shared/services/user.service';

@Component({
  selector: 'app-add-members-dialog',
  templateUrl: 'add-members-dialog.component.html',
})
export class AddMembersDialogComponent {
  allusers: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddMembersDialogComponent>,
    private userService: UserService,
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

  onSubmit() {
    // Collect the selected users
    const selectedUsers = this.allusers.filter((user) => user.isSelected);
    // Close the dialog
    this.dialogRef.close(selectedUsers);
  }

  onClose() {
    this.dialogRef.close();
  }
}
