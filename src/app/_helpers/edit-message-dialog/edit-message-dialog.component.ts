import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserChat } from 'src/app/_shared/models/UserChat';

@Component({
  selector: 'app-edit-message-dialog',
  templateUrl: './edit-message-dialog.component.html',
})
export class EditMessageDialogComponent {

  originalContent: string;

  constructor(
    public dialogRef: MatDialogRef<EditMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: UserChat }
  ) {
    this.originalContent = data.message.content;    
  }

  /**
 * Saves the edited content of a message and closes the dialog.
 * Restores the original content of the message to its previous state.
 */
  saveEdit() {
    this.data.message.editedContent = this.originalContent;
    this.dialogRef.close(this.data.message);
  }

 /**
 * Closes the dialog without saving any changes.
 * This method is typically used when the user wants to discard their edits.
 */
  closeDialog() { 
    this.dialogRef.close();
  }
}
