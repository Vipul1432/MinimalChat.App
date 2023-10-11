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

  /**
   * Handles the cancel action in the dialog.
   * - Closes the dialog without saving any changes.
   */
  onCancelClick(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }

  /**
   * Handles the action of creating a new group.
   * - Collects the group name and selected users' data.
   * - Closes the dialog and provides the group data to the caller.
   */
  onCreateGroupClick(): void {
    const groupData = {
      groupName: this.groupName,
      selectedUsers: this.selectedUsers,
    };
    console.log(this.selectedUsers);

    this.dialogRef.close(groupData);
  }

  /**
   * Handles changes in the checkbox state for a user.
   * - Adds or removes the user's ID to/from the selected users list.
   */
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

  /**
   * Tracks users in the list by their user ID.
   * - Provides a unique identifier for ngFor to track users efficiently.
   */
  trackByUserId(index: number, user: any): string {
    return user.id;
  }

  /**
   * Retrieves the list of selected users.
   * - Returns the selected users' IDs.
   */
  getSelectedUsers(): string[] {
    console.log(this.selectedUsers);
    return this.selectedUsers;
  }
}
