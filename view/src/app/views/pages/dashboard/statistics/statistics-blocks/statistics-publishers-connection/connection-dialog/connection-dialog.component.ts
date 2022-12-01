import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectionOpenDialogData } from '../../../../../../../shared/interfaces/statistic.interface';

@Component({
  templateUrl: 'connection-dialog.component.html'
})
export class ConnectionDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConnectionOpenDialogData
  ) {}
}
