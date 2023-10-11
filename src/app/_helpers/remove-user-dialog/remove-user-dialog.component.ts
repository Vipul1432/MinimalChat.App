import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GroupChatService } from 'src/app/_shared/services/group-chat.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-remove-user-dialog',
  templateUrl: './remove-user-dialog.component.html',
  styleUrls: ['./remove-user-dialog.component.css'],
})
export class RemoveUserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  users = this.data.groupUsers;

  /**
   * Opens a confirmation dialog to remove a user from a group.
   * Displays a warning dialog with options to confirm or cancel the removal.
   * If confirmed, displays a success message; if canceled, displays a message indicating that the user is safe.
   * Finally, closes the dialog with the user's ID as the result.
   */
  removeUser(user: any) {
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
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          console.log(user.userId);
          swalWithBootstrapButtons.fire(
            'Removed!',
            `${user.userName} has been removed from this group.`,
            'success'
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            `${user.userName} is safe in this group :)`,
            'error'
          );
        }
      });
    this.dialogRef.close(user.userId);
  }

  /**
   * Handles the action of closing the dialog without saving.
   * - Closes the dialog without returning any data.
   */
  onClose() {
    this.dialogRef.close();
  }
}
