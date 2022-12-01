import { Component, OnInit, Input, OnDestroy, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from 'shared/services/navigation.service';
import { Subscription } from 'rxjs';
import { AppTranslationService } from 'shared/services/translation/translation.service';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { EventCollectorService } from '../../services/event-collector/event-collector.service';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../../environments/environment';
import { NotificationDataTransitionService } from '../notifications/_services/notification-data-transition.service';

@Component({
  selector: 'app-header-top',
  templateUrl: './header-top.component.html',
  styleUrls: ['./header-top.component.scss']
})
export class HeaderTopComponent implements OnInit, OnDestroy {
  @Input() noticesPanel;

  subscriptions: Subscription = new Subscription();

  public userAvatar: string;

  public imgFolderURL: string = environment.publicFolder + '/images/pp/';

  public notWatchedNotices = 0;

  public prebidUserOnlyPerm = false;

  public notificationPerm = false;

  public animateAlert = false;

  layoutConf: any;

  menuItems: any;

  user: any = {};

  egretThemes: any[] = [];

  constructor(
    protected layout: LayoutService,
    protected navService: NavigationService,
    public themeService: ThemeService,
    public translate: TranslateService,
    protected appTranslation: AppTranslationService,
    protected renderer: Renderer2,
    public getUserInfo: EventCollectorService,
    protected auth: AuthService,
    protected transitService: NotificationDataTransitionService
  ) {}

  ngOnInit() {
    this.appTranslation.lang = this.appTranslation.existingLangs.includes(this.translate.getBrowserLang())
      ? this.translate.getBrowserLang()
      : 'en';
    this.appTranslation.lang = this.appTranslation.lang === 'uk' ? 'ru' : this.appTranslation.lang;

    const notifySub = this.transitService.getCountNotWatchedNotices().subscribe((notWatchedNotices) => {
      notWatchedNotices > 0 && this.animateAlertIcon();
      this.notWatchedNotices = notWatchedNotices;
    });
    this.subscriptions.add(notifySub);

    const userInfoSub = this.getUserInfo.managedUserInfo$.subscribe((data) => {
      this.user = data;

      this.notificationPerm = this.user.permissions.includes('canReadOwnNotices');
      this.prebidUserOnlyPerm =
      this.user.permissions.includes('canSeeWBidIntegrationPage') || this.user.permissions.includes('canSeeWBidAnalyticsOnly');
    });
    this.subscriptions.add(userInfoSub);

    const userAvatarSub = this.getUserInfo.manageUserAvatar$.subscribe((avatar) => {
      this.userAvatar = avatar;
    });
    this.subscriptions.add(userAvatarSub);

    this.layoutConf = this.layout.layoutConf;
    this.egretThemes = this.themeService.egretThemes;

    const menuItemSub = this.navService.menuItems$.subscribe((res) => {
      res = res.filter((item) => item.type !== 'icon' && item.type !== 'separator');

      this.menuItems = res;
    });
    this.subscriptions.add(menuItemSub);
  }

  changeTheme(theme) {
    this.themeService.changeTheme(this.renderer, theme);
  }

  toggleNotices() {
    this.noticesPanel.toggle();
  }

  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }

    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }

  animateAlertIcon(): void {
    this.animateAlert = true;
    setTimeout(() => (this.animateAlert = false), 500);
  }

  logOut() {
    this.auth.out();
  }

  ngOnDestroy() {
    if (this.subscriptions !== undefined) {
      this.subscriptions.unsubscribe();
    }
  }
}
