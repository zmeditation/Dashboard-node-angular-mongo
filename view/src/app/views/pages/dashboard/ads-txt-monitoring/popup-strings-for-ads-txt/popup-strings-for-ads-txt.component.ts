import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-strings-for-ads-txt',
  templateUrl: './popup-strings-for-ads-txt.component.html',
  styleUrls: ['./popup-strings-for-ads-txt.component.scss']
})
export class PopupStringsForAdsTxtComponent implements OnInit {
  public copiedStrings: Array<string> = [];

  constructor(public dialogRef: MatDialogRef<PopupStringsForAdsTxtComponent>, @Inject(MAT_DIALOG_DATA) public data) {}

  ngOnInit() {
    if (this.data.success) {
      for (const str of this.data.dataStrings) {
        const row = `
          ${ str.domain }, ${ str.publisherAccountID }, 
          ${ str.accountType }${ str.certificateAuthorityID !== '' ? ', ' + str.certificateAuthorityID : '' }
        `;
        this.copiedStrings.push(row);
      } 
    }
    

  }

  copyAllRows(): void {
    const joinedString = this.copiedStrings.join('\n');
    const textAreaForCopy = document.createElement('textarea');
    const popupBlock = document.getElementById('popup-dialog-adstxt');
    textAreaForCopy.style.height = '0px';
    textAreaForCopy.value = joinedString;
    popupBlock.appendChild(textAreaForCopy);
    textAreaForCopy.focus();
    textAreaForCopy.select();
    document.execCommand('copy');
    popupBlock.removeChild(textAreaForCopy);
    this.dialogRef.close();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
