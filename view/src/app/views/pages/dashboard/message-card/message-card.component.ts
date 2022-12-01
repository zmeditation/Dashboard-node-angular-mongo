import { Component, OnInit } from '@angular/core';
import { egretAnimations } from 'shared/animations/egret-animations';
import { Subscription } from 'rxjs';
import { CrudService } from 'shared/services/cruds/crud.service';
import { GetResponseType } from 'shared/types/response';

@Component({
  selector: 'app-message-card',
  templateUrl: './message-card.component.html',
  styleUrls: ['./message-card.component.scss'],
  animations: egretAnimations
})
export class MessageCardComponent implements OnInit {

  public status: boolean = false;

  public messages: any[] = [];

  private subscriptions: Subscription = new Subscription();

  constructor(
    private crud: CrudService
  ) {}

  ngOnInit() {
    this.getNotice();
  }

  private getNotice() {
    const noticeSubscription = this.crud.getNotice().subscribe((resp: GetResponseType) => {
      const { data } = resp;
      if (data) {
        this.status = true;
        data.forEach(el => this.messages.push(el));
      }
    });

    this.subscriptions.add(noticeSubscription);
  }

  public get hasNotice() {
    return !!this.messages.length;
  }
}
