import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { DeleteNotificationQuery, Notification, NotificationForUI, ValidResOfDeleteMsg } from 'shared/interfaces/notifications.interface';
import { NotificationEndpointsService } from '../../../services/cruds/notification-endpoints.service';
import { NotificationCrudService } from '../_services/notification-crud.service';
import { NotificationDataTransitionService } from '../_services/notification-data-transition.service';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() noticeObj: NotificationForUI;

  @Input() currentUserId: string;

  @Input() notWatchedNotices: number;

  @Input() showNoticesCollection: boolean;

  @Output() getNotices = new EventEmitter<string>();

  @ViewChild('container') container: ElementRef;

  public messagesCount = 0;

  public isDeletionOccur = false;

  private scrollContainer: any;

  private subscriptions: Subscription = new Subscription();

  constructor(
    protected notificationService: NotificationCrudService, 
    protected notificationEndpointsService: NotificationEndpointsService,
    protected transitService: NotificationDataTransitionService
  ) {}

  ngOnInit() {
    this.getCountNotWatchedNotices();
    this.noticesLength();
  }

  ngAfterViewInit() {
    this.scrollContainer = this.container.nativeElement;
    this.scrollToTop();
  }

  ngOnChanges(changes) {
    this.noticesLength();
  }

  getCountNotWatchedNotices(): void {
    const getCountSub = this.transitService.getCountNotWatchedNotices()
      .subscribe((notWatchedNotices) => {
        this.notWatchedNotices = notWatchedNotices;
      });
    this.subscriptions.add(getCountSub);
  }

  deleteNotice(notice: Notification): void {
    const query: DeleteNotificationQuery = {
      msgId: notice._id
    };

    this.isDeletionOccur = true;

    const deleteNoticeSub = this.notificationEndpointsService.deleteNotice(query).subscribe(
      (res: ValidResOfDeleteMsg) => {
        this.isDeletionOccur = false;
        if (res.deletedCount > 0) {
          this.deleteNotExistNotice(notice._id);
          this.noticesLength();
          // tslint:disable-next-line: no-unused-expression
          !notice.isWatched && this.deductNotWatchedNotice();
        }
      },
      () => (this.isDeletionOccur = false)
    );
    this.subscriptions.add(deleteNoticeSub);
  }

  public deleteNoticeCollection(e: Event, msgType: string): void {
    const msgTypesExists = ['systemNf', 'userNf', 'billingNf'];

    try {
      e.preventDefault();
      if (!msgTypesExists.includes(msgType)) { throw new Error('msgType is not valid.'); }

      this.isDeletionOccur = true;

      const query = {
        userId: this.currentUserId,
        msgTypes: [msgType]
      };

      const deleteCollections = this.notificationEndpointsService.deleteNoticesCollections(query)
        .subscribe(
          (res: ValidResOfDeleteMsg) => {          
            if (res.deletedCount > 0) {
              this.isDeletionOccur = false;
              this.getNotices.emit(this.currentUserId);
              this.noticesLength();

            }
          },
          () => (this.isDeletionOccur = false)
        );
      this.subscriptions.add(deleteCollections);
    } catch (error) {
      console.error(error);
    }
  }

  protected deductNotWatchedNotice(): void {
    --this.notWatchedNotices;
    this.transitService.setCountNotWatchedNotices(this.notWatchedNotices);
  }

  protected deleteNotExistNotice(noticeId: string): void {
    this.noticeObj.notifications = this.noticeObj.notifications.filter((obj) => obj._id !== noticeId);
  }

  protected noticesLength(): void {
    this.messagesCount = this.noticeObj.notifications.length;
  }

  protected scrollToTop(): void {
    this.scrollContainer.scroll({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Not using now
  // scrollToBottom(): void {
  //   this.scrollContainer.scroll({
  //     top: this.scrollContainer.scrollHeight,
  //     behavior: 'smooth'
  //   });
  // }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
