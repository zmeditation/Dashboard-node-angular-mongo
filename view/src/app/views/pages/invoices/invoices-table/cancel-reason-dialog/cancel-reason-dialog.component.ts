import { Component } from '@angular/core';
import { CANCEL_REASON } from 'shared/interfaces/invoice.interface';

@Component({
  selector: 'app-cancel-reason-dialog',
  templateUrl: './cancel-reason-dialog.component.html',
  styleUrls: ['./cancel-reason-dialog.component.scss']
})
export class CancelReasonDialogComponent {
  reasons = Object.values(CANCEL_REASON);

  constructor() {}
}
