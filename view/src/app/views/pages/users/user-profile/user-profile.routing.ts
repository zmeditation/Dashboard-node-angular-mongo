import { Routes } from '@angular/router';
import { UserSettingsComponent } from './user-profile/settings/user-settings.component';
import { UserAttachmentsComponent } from './user-profile/attachments/user-attachments.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ApiTokenGeneratorComponent } from './user-profile/api-token-generator/api-token-generator.component';
import { UserOverviewComponent } from 'shared/components/user-profile/overview/user-overview.component';

export const UsersProfileRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'overview',
        component: UserOverviewComponent,
        data: { title: 'Overview', breadcrumb: 'Overview' }
      },
      {
        path: 'attachments',
        canActivate: [NgxPermissionsGuard],
        component: UserAttachmentsComponent,
        data: {
          title: 'Attachments',
          breadcrumb: 'Attachments',
          permissions: {
            only: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'api-token-generator',
        component: ApiTokenGeneratorComponent,
        data: {
          title: 'API Access',
          breadcrumb: 'API Access',
          permissions: {
            only: ['canUseAPIAccessForReports'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'edit',
        component: UserSettingsComponent,
        data: {
          title: 'Edit',
          breadcrumb: 'Edit'
        }
      }
    ]
  }
];
