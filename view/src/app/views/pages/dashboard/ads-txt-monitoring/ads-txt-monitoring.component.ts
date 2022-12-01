import { Component, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from 'shared/services/cruds/crud.service';
import { OpenPopup } from './services/open-popup';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { egretAnimations } from 'shared/animations/egret-animations';
import { SocketDefault } from 'shared/services/socket.service';
import { EventCollectorService } from '../../../../shared/services/event-collector/event-collector.service';
import { DomainData } from './services/domain-data.service';
import { UserPermissions } from 'shared/services/user-permissions';
import { AdsTxtEndpointsService } from '../../../../shared/services/cruds/ads-txt.endpoints.service';

@Component({
  selector: 'app-ads-txt-monitoring',
  templateUrl: './ads-txt-monitoring.component.html',
  styleUrls: ['./ads-txt-monitoring.component.scss'],
  animations: egretAnimations
})
export class AdsTxtMonitoringComponent extends DomainData implements OnInit, OnDestroy {

  public displayedColumns = ['domain', 'adsTxt', 'checked', 'origins'];
  
  protected ownUserId: string;

  private subscriptions = new Subscription(); 

  constructor(
    protected adsTxtEndService: AdsTxtEndpointsService,
    public dialog: MatDialog,
    public openPopup: OpenPopup,
    protected userPermissions: UserPermissions,
    private socket: SocketDefault,
    private eventCollectorService: EventCollectorService
  ) {
    super(adsTxtEndService);
  }

  ngOnInit() {
    this.socketsListeners();
    this.getData();
    this.userPermissions.permissionsByUsers();
    this.getOwnUserId();
  }
  
  public setPanelStatus(panel: any): void {
    panel.expandPanel = true;
    
    this.checkedDomains.forEach((el) => {
      if (el._id !== panel._id) { el.expandPanel = false; } 
    });
  }

  public filterPubsByAmId(value: string): void {
    if (value === 'all') {
      this.getData();
    } else if (value === 'mine') {
      this.checkedDomains = this.checkedDomains
        .filter((pub) => (pub.am === this.ownUserId));

      !this.checkedDomains.length && (this.noPublishers = true);
    }
  }

  protected getOwnUserId(): void {
    const suerInfoSub = this.eventCollectorService.managedUserInfo$
      .subscribe(user => {
        this.ownUserId = user._id;
      })
    this.subscriptions.add(suerInfoSub);
  }

  protected socketsListeners(): void {
    const idEventSub = this.socket.fromEvent('id')
      .subscribe((data: string) => {
        const storageObj = { socket: data.toString() };
        sessionStorage.setItem('socketId', JSON.stringify(storageObj));
      }); 
    this.subscriptions.add(idEventSub);

    const adsEventSub = this.socket.fromEvent('ads.txt')
      .subscribe((data: any) => {       
        if (data.message === 'UPDATED_DATA') { this.getData(); } 
        if (data.message === 'UPDATING') { this.isUploading = true } 
      });
    this.subscriptions.add(adsEventSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    ['ads.txt', 'id'].forEach(str => this.socket.removeListener(str)); 
  }
}
