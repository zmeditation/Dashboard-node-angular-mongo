import { Routes } from '@angular/router';
import { ReportManagementComponent } from './report-management/report-management.component';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ApiManagementComponent } from './api-management/api-management.component';
import { TacReportComponent } from './tac-report/tac-report.component';
import { CommonReportsViewerComponent } from './common-reports-viewer/common-reports-viewer.component';
import { WbidReportComponent } from './wbid-report/wbid-report.component';
import { OrtbReportComponent } from './ortb-report/ortb-report.component';

export const ReportsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'report-management',
        canActivate: [NgxPermissionsGuard],
        component: ReportManagementComponent,
        data: {
          title: 'Report Management',
          breadcrumb: 'Report Management',
          permissions: {
            only: ['canSeeReportManagementPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'report-viewer',
        canActivate: [NgxPermissionsGuard],
        component: ReportViewerComponent,
        data: {
          title: 'Report Viewer',
          breadcrumb: 'Report Viewer',
          permissions: {
            only: ['canSeeReportsPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'api-management',
        canActivate: [NgxPermissionsGuard],
        component: ApiManagementComponent,
        data: {
          title: 'API Management',
          breadcrumb: 'API Management',
          permissions: {
            only: ['canSeeAPIManagementPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'tac',
        canActivate: [NgxPermissionsGuard],
        component: TacReportComponent,
        data: {
          title: 'TAC Report',
          breadcrumb: 'TAC Report',
          permissions: {
            only: ['canReadOwnTacReports', 'canReadAllTacReports'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'wbid',
        canActivate: [NgxPermissionsGuard],
        component: WbidReportComponent,
        data: {
          title: 'WBID Analytics tables',
          breadcrumb: 'WBID Analytics tables',
          permissions: {
            only: ['canSeeWBidTablesPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'ortb',
        canActivate: [NgxPermissionsGuard],
        component: OrtbReportComponent,
        data: {
          title: 'oRTB Reports',
          breadcrumb: 'oRTB Reports',
          permissions: {
            only: ['canSeeReportsPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'report',
        canActivate: [NgxPermissionsGuard],
        component: CommonReportsViewerComponent,
        data: {
          title: 'Reports Page',
          breadcrumb: 'report',
          permissions: {
            only: ['canSeeReportsPage'],
            redirectTo: '/sessions/404'
          }
        }
      }
    ]
  }
];
