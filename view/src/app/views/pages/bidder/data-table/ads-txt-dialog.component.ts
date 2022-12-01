import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from '../services/models';

@Component({
  selector: 'app-ads-txt-dialog-component',
  templateUrl: './ads-txt-dialog-component.html'
})
export class AdsTxtDialogComponent {
  public clicked = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: DialogData
  ) {}

  async copyHelper(value: string): Promise<any> {
    const copyhelper: HTMLTextAreaElement = document.createElement('textarea');
    copyhelper.className = 'copyhelper';
    document.body.appendChild(copyhelper);
    copyhelper.value = value;
    copyhelper.select();
    document.execCommand('copy');
    document.body.removeChild(copyhelper);
    return;
  }

  copyAdsTxt(): void {
    const list: Array<any> = this.data[0].adsTxtStrings;
    const result = [];
    for (const el of list) {
      result.push(`${ el.domain }, ${ el.publisherAccountID }, ${ el.accountType }, ${ el.certificateAuthorityID || '' }`);
    }


    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(result.join('\r\n'))
        .then(() => (this.clicked = true))
        .catch((err) => console.error(err));
    } else {
      this.copyHelper(result.join('\r\n'))
        .then(() => (this.clicked = true))
        .catch((err) => console.error(err));
    }


  }
}
