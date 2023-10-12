import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-make-user-admin-dialog',
  templateUrl: './make-user-admin-dialog.component.html',
  styleUrls: ['./make-user-admin-dialog.component.css'],
})
export class MakeUserAdminDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MakeUserAdminDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  users = this.data.groupUsers;

  /**
   * Closes the current dialog and returns the selected user as the result.
   * @param user - The user to be marked as an admin within the dialog.
   * @returns void
   */
  makeUserAdmin(user: any) {
    this.dialogRef.close(user);
  }

  /**
   * Handles the action of closing the dialog without saving.
   * - Closes the dialog without returning any data.
   */
  onClose() {
    this.dialogRef.close();
  }
}
