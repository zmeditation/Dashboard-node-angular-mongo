import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { CrudService } from "shared/services/cruds/crud.service";
import { Subscription } from 'rxjs';
import { egretAnimations } from "shared/animations/egret-animations";

@Component({
  selector: 'app-user-attachments',
  templateUrl: './user-attachments.component.html',
  styleUrls: ['./user-attachments.component.scss'],
  animations: egretAnimations
})
export class UserAttachmentsComponent implements OnInit, OnDestroy {
  public urlForDownload = `${ environment.publicFolder }/attachments/`;

  private listOfAttachments: Array<string> = [];

  subscriptionForList: Subscription;

  constructor(private crud: CrudService) {}

  ngOnInit() {
    this.getAttachmentsList();
  }

  download(file) {
    const buttonDownload: any = document.getElementById(file);
    buttonDownload.href = this.urlForDownload + file;
  }

  getAttachmentsList() {
    this.subscriptionForList = this.crud.getListOfAttachments().subscribe((list: any) => {
      if (list.success) {
        this.listOfAttachments = list.result;
      }

    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionForList !== undefined) { this.subscriptionForList.unsubscribe(); }
  }
}
