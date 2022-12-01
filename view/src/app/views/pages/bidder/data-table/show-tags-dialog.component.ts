import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../services/models';

@Component({
  selector: 'app-show-tags-dialog-component',
  templateUrl: './show-tags-dialog-component.html',
  styleUrls: ['./show-tags-dialog.component.scss']
})
export class ShowTagsDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {}

  copyTag(event): void {
    const target = event.target;
    target.select();
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }
}
