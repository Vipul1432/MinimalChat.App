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

  saveEdit() {
    this.data.message.editedContent = this.originalContent;
    this.dialogRef.close(this.data.message);
  }

  closeDialog() { 
    this.dialogRef.close();
  }
}
