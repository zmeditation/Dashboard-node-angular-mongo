import { Component, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from "shared/services/cruds/crud.service";
import { Subscription } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { egretAnimations } from "shared/animations/egret-animations";

export type Token = {
  token: string,
  message: string,
  expired: boolean
}

@Component({
  selector: 'app-api-token-generator',
  templateUrl: './api-token-generator.component.html',
  styleUrls: ['./api-token-generator.component.scss'],
  animations: egretAnimations
})

export class ApiTokenGeneratorComponent implements OnInit, OnDestroy {
  tokenSubscription: Subscription;

  public valueToken = '[YOUR_TOKEN]';

  public urlWithToken = ``;

  public isCopied: any = { color: '', value: 'COPY' };

  constructor(private crud: CrudService) {}

  ngOnInit() {}

  toOrderToken() {
    this.tokenSubscription = this.crud.getAPIToken().subscribe((token: Token) => {
      this.valueToken = token.token;
      this.urlWithToken =
        `${ environment.workerApiURL_1 }
        /reports/run-report/api/token=${ this.valueToken }
        &type=analytics-api&range=yesterday&metrics=impressions,clicks,ctr,cpm,revenue&dimensions=daily,placement,size,inventoryType,domain`;
    });
  }

  copyString(string) {
    const textAreaForCopy = document.createElement('textarea');
    const textareaBlock = document.getElementById('place-for-link-with-token');
    textAreaForCopy.style.height = '0px';
    textAreaForCopy.value = string;
    textareaBlock.appendChild(textAreaForCopy);
    textAreaForCopy.focus();
    textAreaForCopy.select();
    document.execCommand('copy');
    textareaBlock.removeChild(textAreaForCopy);

    this.isCopied = { color: 'accent', value: 'COPIED' };
    setTimeout(() => {
      this.isCopied = { color: '', value: 'COPY' };
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this.tokenSubscription !== undefined) {
      this.tokenSubscription.unsubscribe();
    }
  }
}
