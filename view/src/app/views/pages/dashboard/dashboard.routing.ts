import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { StatisticsComponent } from './statistics/statistics.component';
import { AdsTxtMonitoringComponent } from './ads-txt-monitoring/ads-txt-monitoring.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
          breadcrumb: 'DASHBOARD'
        }
      },
      {
        path: 'statistics',
        canActivate: [NgxPermissionsGuard],
        component: StatisticsComponent,
        data: {
          title: 'Statistics',
          breadcrumb: 'Statistics',
          permissions: {
            only: ['canReadAllReports', 'canReadOwnPubsReports', 'canReadAllPubsReports'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'ads_txt_info',
        canActivate: [NgxPermissionsGuard],
        component: AdsTxtMonitoringComponent,
        data: {
          title: 'Ads.txt',
          breadcrumb: 'Ads txt monitor',
          permissions: {
            only: ['canSeeUsersPage', 'canAddReports', 'canReadAllPubs'],
            redirectTo: '/sessions/404'
          }
        }
      }
    ]
  }
];
