import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-temporary-message-error',
  templateUrl: './temporary-message-error.component.html',
  styleUrls: ['./temporary-message-error.component.scss']
})
export class TemporaryMessageErrorComponent {
  constructor(public dialogRef: MatDialogRef<TemporaryMessageErrorComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
