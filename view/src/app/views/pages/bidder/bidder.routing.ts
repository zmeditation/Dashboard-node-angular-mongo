import { Routes } from '@angular/router';
import { DataTableComponent } from './data-table/data-table.component';
import { ShowTagsComponent } from './actions/show-tags/show-tags.component';
import { EditPlacementComponent } from './actions/edit-placement/edit-placement.component';
import { AddPlacementComponent } from './actions/add-placement/add-placement.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { BidderComponent } from './bidder.component';
import { DFPStartScreenComponent } from './dfpstart-screen/dfpstart-screen.component';
import { WaitForIntegrationComponent } from './dfpstart-screen/wait-for-integration/wait-for-integration.component';
import { WbidChartsComponent } from './analytics/wbid-charts/wbid-charts.component';
import { TrialComponent } from './trial/trial.component';

export const BidderRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: BidderComponent
      },
      {
        path: 'configs/new',
        component: AddPlacementComponent,
        pathMatch: 'full',
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'New Config',
          breadcrumb: 'New Config',
          permissions: {
            only: ['canCreateWBidPlacements'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'configs',
        component: DataTableComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'All Configs',
          breadcrumb: 'All Configs',
          permissions: {
            only: ['canSeeWBidPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'sites',
        component: DataTableComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'All Sites',
          breadcrumb: 'All Sites',
          permissions: {
            only: ['canSeeWBidPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'sites/new',
        component: AddPlacementComponent,
        pathMatch: 'full',
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'New Site',
          breadcrumb: 'New Site',
          permissions: {
            only: ['canCreateWBidPlacements'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'users',
        component: DataTableComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'All Users',
          breadcrumb: 'All Users',
          permissions: {
            only: ['canSeeAllWBidUsers', 'canSeeOwnWBidUsers'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'configs/edit',
        component: EditPlacementComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'Edit Config',
          breadcrumb: 'Edit Config',
          permissions: {
            only: ['canEditWBidPlacements', 'canPreviewWBidPlacements'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'tags',
        component: ShowTagsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'tags',
          breadcrumb: 'Tags',
          permissions: {
            only: ['canCreateWBidPlacements'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'start',
        component: DFPStartScreenComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'start',
          breadcrumb: 'Start',
          permissions: {
            only: ['canSeeWBidIntegrationPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'start/wait',
        component: WaitForIntegrationComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          title: 'Please wait...',
          breadcrumb: 'Wait',
          permissions: {
            only: ['canSeeWBidIntegrationPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'analytics-charts',
        canActivate: [NgxPermissionsGuard],
        component: WbidChartsComponent,
        data: {
          title: 'WBid Analytics charts',
          breadcrumb: 'WBid Analytics charts',
          permissions: {
            only: ['canSeeWBidChartsPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'trial',
        canActivate: [NgxPermissionsGuard],
        component: TrialComponent,
        data: {
          title: 'Trial Period Expired',
          breadcrumb: 'Trial Period Expired',
          permissions: {
            only: ['canSeeWBidTrialPage', 'canDeleteWBidPlacements'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  }
];
