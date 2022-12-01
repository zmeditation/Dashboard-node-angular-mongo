import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../services/models';

@Component({
  selector: 'app-data-table-dialog-component',
  templateUrl: './data-table-dialog-component.html'
})
export class EditSiteDomainDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {}
}
