import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.css'],
})
export class CreateGroupDialogComponent {
  groupName: string = '';
  selectedUsers: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<CreateGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize selectedUsers with user IDs that are initially selected.
    this.selectedUsers = data.users
      .filter((user: any) => user.selected)
      .map((user: any) => user.id);
  }

  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

  onCreateGroupClick(): void {
    const groupData = {
      groupName: this.groupName,
      selectedUsers: this.selectedUsers,
    };
    console.log(this.selectedUsers);

    this.dialogRef.close(groupData);
  }

  onCheckboxChange(user: any): void {
    if (user.selected) {
      console.log(user.id);

      this.selectedUsers.push(user.id);
      console.log(this.selectedUsers);
    } else {
      // If the checkbox is unchecked, remove the user's ID from selectedUsers.
      const index = this.selectedUsers.indexOf(user.id);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
  }

  trackByUserId(index: number, user: any): string {
    return user.id;
  }
  getSelectedUsers(): string[] {
    console.log(this.selectedUsers);
    return this.selectedUsers;
  }
}
