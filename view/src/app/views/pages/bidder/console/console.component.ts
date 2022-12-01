import { Component, Injectable, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'shared/services/_alert';
import { Subscription } from 'rxjs';
import { RXBox } from 'rxbox';
import { Router } from '@angular/router';
import { WaitForIntegrationComponent } from '../dfpstart-screen/wait-for-integration/wait-for-integration.component';
import { TranslateService } from '@ngx-translate/core';
import { SocketDefault } from 'shared/services/socket.service';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  providers: [WaitForIntegrationComponent]
})
@Injectable()
export class ConsoleComponent implements OnInit, OnDestroy {
  WBidSubscription: Subscription;

  SocketIdSubscription: Subscription;

  DfpIntegrationURLSubscription: Subscription;

  prefix = 'WBID.PROPERTIES.TABLE.';

  constructor(
    private socket: SocketDefault,
    private alertService: AlertService,
    private router: Router,
    private wait: WaitForIntegrationComponent,
    private store: RXBox,
    public translate: TranslateService
  ) {}

  ngOnInit() {
    this.connectSocketAndListen();
  }

  connectSocketAndListen(): void {
    const SocketId = sessionStorage.getItem('socketId');

    if (this.socket.ioSocket.id !== SocketId) {
      this.SocketIdSubscription = this.socket.fromEvent('id').subscribe((data: string) => {
        const storageObj = { socket: data.toString() };
        sessionStorage.setItem('socketId', JSON.stringify(storageObj));
      }); 
    }


    this.WBidSubscription = this.socket.fromEvent('console')
      .subscribe((data: { message: string; last?: boolean; socketId?: string; type?: string }) => {
        this.alertService.clear();
        if (!data.message) { return; }


        this.translate.get(this.prefix + data.message).subscribe((message: string) => {
          switch (data.type) {
            case 'success':
              this.alertService.success(message);
              break;
            case 'error':
              this.alertService.error(message);
              break;
            case 'warn':
              this.alertService.warn(message);
              break;
            default:
              this.alertService.info(message);
          }
        });

        if (data.message === 'Integration completed successfully') {
          let { id, name } = this.wait.getUserParams();
          if (!id || !name) {
            id = this.store.getState().id;
            name = this.store.getState().name;
          }
          this.router
            .navigate(['wbid', 'sites'], {
              queryParams: { userId: id, name }
            })
            .catch((e) => console.error(e.message));
        }

        if (data.last === true) {
          setTimeout(() => {
            this.alertService.clear();
          }, 5000); 
        }


      });

    this.DfpIntegrationURLSubscription = this.socket.fromEvent('prebid dfp integration').subscribe((data: any) => {
      window.open(data.message, 'Google Login', 'toolbar=yes, resizable=yes, top=300, left=100, width=500,height=500');
    });
  }

  ngOnDestroy() {
    if (this.router.url.search(/\/wbid\//gi) === -1) {
      this.socket.removeListener('console');
      this.socket.removeListener('prebid dfp integration');
    }
    if (this.WBidSubscription !== undefined) { this.WBidSubscription.unsubscribe(); }

    if (this.DfpIntegrationURLSubscription !== undefined) { this.DfpIntegrationURLSubscription.unsubscribe(); }

    if (this.SocketIdSubscription !== undefined) { this.SocketIdSubscription.unsubscribe(); }

  }
}
