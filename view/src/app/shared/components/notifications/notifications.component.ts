import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, TemplateRef, Input } from '@angular/core';
import { NotificationCrudService } from './_services/notification-crud.service';
import { NotificationDataTransitionService } from './_services/notification-data-transition.service';
import {
  SocketAc,
  SocketAdmin,
  SocketAdOps,
  SocketCeo,
  SocketDefault,
  SocketPub,
  SocketSeniorAc,
  SocketMedia,
  SocketFinance
} from '../../services/socket.service';
import { WrappedSocket } from 'ngx-socket-io/src/socket-io.service';
import { Subscription } from 'rxjs';
import { EventCollectorService } from '../../../shared/services/event-collector/event-collector.service';
import { NotificationForUI, UserDataForSocket, ValidResOfDeleteMsg } from '../../../shared/interfaces/notifications.interface';
import { TranslateService } from '@ngx-translate/core';
import { NotificationEndpointsService } from '../../services/cruds/notification-endpoints.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  @Input() noticesPanel;

  @ViewChild('outlet', { read: ViewContainerRef }) outletRef: ViewContainerRef;

  @ViewChild('content', { read: TemplateRef }) contentRef: TemplateRef<any>;

  public openNoticeBlockName = '';

  public buttonText = '';

  public notifications: NotificationForUI[] = [];

  public noticesCount = 0;

  public isRenderedComponent = false;

  public isCanAddNotice = '';

  protected notWatchedNotices = 0;

  protected currentUserId = '';

  private subscriptions = new Subscription();

  constructor(
    public event: EventCollectorService,
    private notificationService: NotificationCrudService,
    protected notificationEndpointsService: NotificationEndpointsService,
    private transitService: NotificationDataTransitionService,
    private translate: TranslateService,
    /*
      will install socket via setSocketRoomByRole method
      SocketAc || SocketAdmin || SocketAdOps || SocketCeo || SocketDefault || SocketPub || SocketSeniorAc;
    */
    private socket: SocketDefault
  ) {}

  ngOnInit() {
    this.initAllNotificationData();
    this.setRenderingNotices();
    this.initSubscriptions();
  }

  protected async initAllNotificationData(): Promise<void> {
    const userData = await this.getStoredUserData();

    this.currentUserId = userData.id;
    await this.setNotificationsByUserId(this.currentUserId);

    this.socket.emit('set-user-data', userData);
    this.socket = this.setSocketRoomByRole(userData.role);

    this.receiveMsgViaSocket();
  }

  private async getStoredUserData(): Promise<UserDataForSocket> {
    let userData: UserDataForSocket;

    const userDataSub = this.event.managedUserInfo$.subscribe((user) => {
      userData = {
        id: user._id,
        role: user.role,
        name: user.name
      };
    });
    this.subscriptions.add(userDataSub);

    return userData;
  }

  protected async setNotificationsByUserId(userId: string): Promise<void> {
    const notifications = await this.getNotificationsByUserId(userId);    
    this.setNotificationCountData(notifications);
  }

  public getNotificationsByUserId(userId: string): Promise<NotificationForUI[]> {
    return new Promise((resolve) => {
      const query = { userId };
      const getNoticesSub = this.notificationService.getNotices(query)
        .subscribe((notices: NotificationForUI[]) => {          
          this.notifications = notices;

          resolve(this.notifications);
        });
      this.subscriptions.add(getNoticesSub);
    });
  }

  protected setNotificationCountData(notifications: NotificationForUI[]): void {
    if (!notifications.length) {
      console.error('notifications is empty array');
      return;
    }

    this.notWatchedNotices = 0;
    this.noticesCount = 0;

    this.notifications.forEach((obj) => {
      obj.notifications.forEach((notice) => {
        ++this.noticesCount;

        if (!notice.isWatched) {
          ++this.notWatchedNotices;
        }
      });
    });

    this.transitService.setCountNotWatchedNotices(this.notWatchedNotices);
    this.buttonText = (this.notWatchedNotices > 0) 
      ? 'NOTIFICATIONS.CLEAR_ALL_NOTIFICATIONS' 
      : 'NOTIFICATIONS.YOU_HAVE_NOT_NOTIFICATIONS';
  }

  protected receiveMsgViaSocket(): void {
    const socketMsgSub = this.socket.fromEvent('notifications')
      .subscribe(async _ => {
        await this.setNotificationsByUserId(this.currentUserId);
      });
    this.subscriptions.add(socketMsgSub);
  }

  protected setRenderingNotices(): void {
    const langSub = this.translate.onLangChange.subscribe(() => {
      this.rerenderComponent();
    });
    this.subscriptions.add(langSub);

    const collapsingNoticeSub = this.noticesPanel.openedChange.subscribe((isOpenNotification: boolean) => {
      isOpenNotification && this.rerenderComponent();
    });
    this.subscriptions.add(collapsingNoticeSub);
  }

  protected rerenderComponent(): void {
    this.setOpenNoticeBlockName();
    this.isRenderedComponent = true;
    this.outletRef.clear();
    this.outletRef.createEmbeddedView(this.contentRef);
  }

  protected setOpenNoticeBlockName(): void {
    if (!this.notifications) { return }
    this.openNoticeBlockName = '';

    for (const notificationsObj of this.notifications) {
      if (notificationsObj?.notifications?.length) {
        this.openNoticeBlockName = notificationsObj.typeDB;
        break;
      }
    }
  }

  protected toEmptyNotices(): void {
    this.buttonText = 'No New Notifications';
  }

  public deleteNoticesCollections(e: Event): void {
    try {
      e.preventDefault();

      const msgTypesExists = ['systemNf', 'userNf', 'billingNf'];
      const query = {
        userId: this.currentUserId,
        msgTypes: msgTypesExists
      };

      const deleteCollections = this.notificationEndpointsService.deleteNoticesCollections(query)
        .subscribe(async (res: ValidResOfDeleteMsg) => {
          if (res.deletedCount > 0) {
            await this.setNotificationsByUserId(this.currentUserId);
            this.toEmptyNotices();
          }
        });
      this.subscriptions.add(deleteCollections);
    } catch (error) {
      console.error(error);
    }
  }

  protected initSubscriptions(): void {
    const permissionSub = this.event.managedUserInfo$.subscribe((data) => {
      this.isCanAddNotice = data.permissions.includes('canAddCustomNotification');
    });
    this.subscriptions.add(permissionSub);
  }

  protected setSocketRoomByRole(userRole: string): WrappedSocket {
    const socketsRooms = {
      'ADMIN': new SocketAdmin(),
      'CEO': new SocketCeo(),
      'AD OPS': new SocketAdOps(),
      'SENIOR ACCOUNT MANAGER': new SocketSeniorAc(),
      'ACCOUNT MANAGER': new SocketAc(),
      'PUBLISHER': new SocketPub(),
      'MEDIA BUYER': new SocketMedia(),
      'FINANCE MANAGER': new SocketFinance()
    }

    return socketsRooms[userRole] || new SocketDefault();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.socket.removeListener('notifications');
  }
}
