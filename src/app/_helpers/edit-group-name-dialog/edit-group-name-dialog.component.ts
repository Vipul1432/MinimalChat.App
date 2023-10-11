import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-group-name-dialog',
  templateUrl: './edit-group-name-dialog.component.html',
  styleUrls: ['./edit-group-name-dialog.component.css'],
})
export class EditGroupNameDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<EditGroupNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  groupname = this.data.groupname;

  onSaveClick() {
    this.dialogRef.close(this.groupname);
  }

  /**
   * Handles the action of closing the dialog without saving.
   * - Closes the dialog without returning any data.
   */
  onClose() {
    this.dialogRef.close();
  }
}
