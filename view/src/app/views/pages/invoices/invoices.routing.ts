import { Routes } from '@angular/router';
import { InvoicesComponent } from './invoices.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import {RevenueComponent} from './revenue/revenue.component';

export const InvoicesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        canActivate: [NgxPermissionsGuard],
        component: InvoicesComponent,
        data: {
          title: 'Invoices',
          breadcrumb: 'Invoices',
          permissions: {
            only: ['canSeeInvoicesPage'],
            redirectTo: '/sessions/404'
          }
        }
      },
      {
        path: 'revenue',
        canActivate: [NgxPermissionsGuard],
        component: RevenueComponent,
        data: {
          title: 'Revenue',
          breadcrumb: 'Revenue',
          permissions: {
            only: ['canSeeRevenuePage'],
            redirectTo: '/sessions/404'
          }
        }
      }
    ]
  }
];
