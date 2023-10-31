import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-history-options-dialog',
  templateUrl: './history-options-dialog.component.html',
})
export class HistoryOptionsDialogComponent {
  selectedOption: string = 'showAll';
  days: number = 0;

  constructor(public dialogRef: MatDialogRef<HistoryOptionsDialogComponent>) {}

  onSelect(selectedOption?: string, days?: number): void {
    this.dialogRef.close({ selectedOption, days });
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
