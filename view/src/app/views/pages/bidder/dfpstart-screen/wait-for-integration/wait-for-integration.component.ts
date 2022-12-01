import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { RXBox } from 'rxbox';
import { WbidService } from '../../services/shared.service';
import { SocketDefault } from 'shared/services/socket.service';

@Component({
  selector: 'app-wait-for-integration',
  templateUrl: './wait-for-integration.component.html',
  styleUrls: ['./wait-for-integration.component.scss']
})
export class WaitForIntegrationComponent implements OnInit, OnDestroy {
  public value = 0;

  public error = false;

  private unsubscribe$ = new Subject();

  constructor(private socket: SocketDefault, private store: RXBox, private shared: WbidService) {}

  async ngOnInit() {
    if (!Object.keys(this.store.getState()).length) {
      const { id, isPrebidUser, userType, name, role, dashboardId } = await this.shared.getAndSaveUserData();
      this.store.assignState({
        id,
        isPrebidUser,
        userType,
        name,
        role,
        dashboardId
      });
    }

    this.socket
      .fromEvent('progress')
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: any) => {
          this.value = data;
        },
        (err) => console.error(err.error || err)
      );

    this.socket
      .fromEvent('console')
      .takeUntil(this.unsubscribe$)
      .subscribe(
        (data: any) => {
          if (data.type === 'error') { this.error = true; }

        },
        (err) => console.error(err.error || err)
      );

    window.onbeforeunload = function (e) {
      const t = `Please do not close this page until integration is complete`;
      e.returnValue = t;
      return t;
    };
  }

  getUserParams(): { id: string; name: string } {
    const name = this.store.getState().name;
    const id = this.store.getState().id;
    return { id, name };
  }

  ngOnDestroy(): void {
    this.socket.removeAllListeners();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    window.onbeforeunload = undefined;
  }
}
