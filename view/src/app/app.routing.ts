import { Routes } from '@angular/router';
import { AdminLayoutComponent } from 'shared/components/layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from 'shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGuard } from 'shared/services/auth/auth.guard.service';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { IsLoggedInService } from 'shared/services/auth/is-logged-in.service';
import { Oauth2callbackComponent } from './views/pages/bidder/dfpstart-screen/oauth2callback/oauth2callback.component';

export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'sessions', pathMatch: 'full' },
  {
    path: 'sessions',
    component: AuthLayoutComponent,
    canActivate: [IsLoggedInService],
    children: [
      {
        path: '',
        loadChildren: () => import('./views/sessions/sessions.module').then((m) => m.SessionsModule),
        data: { title: 'Session' }
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/dashboard/dashboard.module').then((m) => m.DashboardModule),
        data: {
          title: 'Dashboard',
          breadcrumb: 'Dashboard',
          permissions: {
            only: ['canSeeDashboardPage'],
            redirectTo: 'wbid/analytics-charts' // for users who can't see dashboard (WBID only)
          }
        }
      },
      { path: 'reports', redirectTo: 'reports/report' },
      {
        path: 'reports',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/reports/reports.module').then((m) => m.ReportsModule),
        data: {
          title: 'Reports',
          breadcrumb: 'Reports',
          permissions: {
            only: ['canSeeReportsPage', 'canSeeAPIManagementPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'users',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/users/users.module').then((m) => m.UsersModule),
        data: {
          title: 'Users',
          breadcrumb: 'Users',
          permissions: {
            only: ['canSeeUsersPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      { path: 'invoices', redirectTo: 'invoices/list' },
      {
        path: 'invoices',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/invoices/invoices.module').then((m) => m.InvoicesModule),
        data: {
          title: 'Invoices',
          breadcrumb: 'Invoices',
          permissions: {
            only: ['canSeeInvoicesPage'],
            redirectTo: 'sessions/404'
          }
        }
      },
      { path: 'codes', redirectTo: 'codes/generator' },
      {
        path: 'codes',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/codes/codes.module').then((m) => m.CodesModule),
        data: {
          title: 'Codes',
          breadcrumb: 'Codes',
          permissions: {
            only: ['canSeeCodesPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      { path: 'settings', redirectTo: 'settings/profile' },
      {
        path: 'settings',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/settings/settings.module').then((m) => m.SettingsModule),
        data: {
          title: 'Settings',
          breadcrumb: 'Settings',
          permissions: {
            only: ['canSeeSettingsPage', 'prebidUserWbid', 'canSeeOwnProfilePage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'wbid',
        canActivate: [NgxPermissionsGuard],
        loadChildren: () => import('./views/pages/bidder/bidder.module').then((m) => m.BidderModule),
        data: {
          title: 'wBid',
          breadcrumb: 'wBid',
          permissions: {
            only: ['canSeeWBidPage', 'canSeeWBidChartsPage', 'canSeeWBidTablesPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'oauth2callback',
        canActivate: [NgxPermissionsGuard],
        component: Oauth2callbackComponent,
        data: {
          title: 'oauth2callback',
          breadcrumb: 'oauth2callback',
          permissions: {
            only: ['canSeeWBidPage'],
            redirectTo: '/sessions/404'
          }
        }
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'sessions/404'
  }
];
