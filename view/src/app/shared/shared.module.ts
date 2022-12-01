import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from "@angular/material-moment-adapter";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { NgxPermissionsModule } from 'ngx-permissions';
import { SocketIoModule } from 'ngx-socket-io';

// ONLY REQUIRED FOR **TOP** NAVIGATION LAYOUT
import { HeaderTopComponent } from './components/header-top/header-top.component';
import { SidebarTopComponent } from './components/sidebar-top/sidebar-top.component';
import { FlashMessagesComponent } from './components/flash-messages/flash-messages.component';

// ALL TIME REQUIRED
import { AdminLayoutComponent } from './components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { VideoBackgroundComponent } from './components/video-background/video-background.component';
import { NotificationListComponent } from './components/notifications/notification-list/notification-list.component';
import { CreateNotificationComponent } from './components/notifications/create-notification/create-notification.component';
import { LetItSnowComponent } from './components/let-it-snow/let-it-snow.component';
import { VersionsComponent } from './components/versions/versions.component';
import { SearchFullWidthComponent } from './components/input/search/full-width/full-width.component';
import { ConfirmPopupComponent } from './components/popup/confirm-popup/confirm-popup.component';
import { VersionsPopupComponent } from './components/popup/versions-popup/versions-popup.component';
import { CreateVersionFormVersionsPopupComponent } from './components/popup/versions-popup/create-version-form-versions-popup/create-version-form-versions-popup.component';
import { UpdateVersionFormVersionsPopupComponent } from './components/popup/versions-popup/update-version-versions-popup/update-version-form-versions-popup.component';

// PIPES
import { RelativeTimePipe } from './pipes/relative-time.pipe';
import { ExcerptPipe } from './pipes/excerpt.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { IsoTimeZonePipe } from './pipes/iso-timezone.pipe';
import { NotificationTimePipe } from './pipes/notification-time.pipe';
// DIRECTIVES
import { DirectivesModule } from './directives/directives.module';

// SERVICES
import { ThemeService } from './services/theme.service';
import { LayoutService } from './services/layout.service';
import { NavigationService } from './services/navigation.service';
import { RoutePartsService } from './services/route-parts.service';
import { AuthService } from './services/auth/auth.service';
import { AppConfirmService } from './services/app-confirm/app-confirm.service';
import { AppLoaderService } from './services/app-loader/app-loader.service';
import { AppComfirmComponent } from './services/app-confirm/app-confirm.component';
import { AppLoaderComponent } from './services/app-loader/app-loader.component';
import { FlashMessagesService } from './services/flash-messages.service';
import { TemporaryTokenStorageService } from './services/temporary-token-storage.service';
import {
  SocketAc,
  SocketAdmin,
  SocketAdOps,
  SocketCeo,
  SocketDefault,
  SocketPub,
  SocketSeniorAc,
  SocketMedia
} from './services/socket.service';
import { FormValidators } from './services/form-validators/form-validators';
import { AppTranslationService } from './services/translation/translation.service';
import { VersionEndpointsService } from './services/cruds/version-endpoints.service';
import { TripletsComponent } from './components/statistics/blocks/triplets/triplets.component';
import { UserOverviewComponent } from './components/user-profile/overview/user-overview.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
/*
  Only Required if you want to use Angular Landing
  (https://themeforest.net/item/angular-landing-material-design-angular-app-landing-page/21198258)
*/
// import { LandingPageService } from '../shared/services/landing-page.service';

// SCROLLBAR

// const config: SocketIoConfig = { url: environment.socketURL, options: { secure: true, rejectUnauthorized: false } };

const classesToInclude = [
  HeaderTopComponent,
  SidebarTopComponent,
  FlashMessagesComponent,
  SidenavComponent,
  NotificationsComponent,
  AdminLayoutComponent,
  AuthLayoutComponent,
  BreadcrumbComponent,
  AppComfirmComponent,
  AppLoaderComponent,
  RelativeTimePipe,
  ExcerptPipe,
  SearchPipe,
  IsoTimeZonePipe,
  NotificationTimePipe,
  NotificationListComponent,
  VideoBackgroundComponent,
  CreateNotificationComponent,
  LetItSnowComponent,
  ConfirmPopupComponent,
  VersionsComponent,
  VersionsPopupComponent,
  SearchFullWidthComponent,
  ConfirmPopupComponent,
  UpdateVersionFormVersionsPopupComponent,
  CreateVersionFormVersionsPopupComponent,
  UserProfileComponent,
  UserOverviewComponent,
  TripletsComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTabsModule,
    MatFormFieldModule,
    RouterModule,
    FlexLayoutModule,
    TranslateModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRippleModule,
    MatDialogModule,
    MatMomentDateModule,
    MatDatepickerModule,
    NgxPermissionsModule,
    SocketIoModule,
    DirectivesModule
  ],
  entryComponents: [AppComfirmComponent, ConfirmPopupComponent, AppLoaderComponent],
  providers: [
    FormValidators,
    {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}}
  ],
  declarations: classesToInclude,
  exports: classesToInclude
})
export class SharedModule {
  static forRoot() {
    return {
      ngModule: SharedModule,
      providers: [
        ThemeService,
        LayoutService,
        NavigationService,
        RoutePartsService,
        AppConfirmService,
        AppLoaderService,
        FlashMessagesService,
        AuthService,
        SocketDefault,
        SocketAdmin,
        SocketCeo,
        SocketAdOps,
        SocketSeniorAc,
        SocketAc,
        SocketPub,
        SocketMedia,
        ConfirmPopupComponent,
        AppTranslationService,
        VersionEndpointsService,
        TemporaryTokenStorageService,
      ]
    };
  }
}
