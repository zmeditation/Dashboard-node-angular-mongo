import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { UserPropertiesPageComponent } from './user-properties-page/user-properties-page.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UsersToolsComponent } from './users-tools/users-tools.component';
import { UserProfileComponent } from 'shared/components/user-profile/user-profile.component';
import { UserOverviewComponent } from 'shared/components/user-profile/overview/user-overview.component';

export const UsersRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UsersComponent,
        data: {
          title: 'Users',
          breadcrumb: 'USERS',
          permissions: {
            only: ['canSeeUsersPage']
          }
        }
      },
      {
        path: 'overview/:id',
        canActivate: [NgxPermissionsGuard],
        component: UserProfileComponent,
        children: [{
          path: '',
          component: UserOverviewComponent,
        }],
        data: {
          title: 'Profile Overview',
          breadcrumb: 'Profile Overview',
          permissions: {
            only: ['canSeeUsersPage'],
          }
        }
      },
      { path: 'users', redirectTo: '' },
      {
        path: 'properties/:id',
        canActivate: [NgxPermissionsGuard],
        component: UserPropertiesPageComponent,
        data: {
          title: 'User Properties',
          breadcrumb: 'User Properties',
          permissions: {
            only: ['canSeeUsersPage']
          }
        }
      },
      {
        path: 'tools',
        canActivate: [NgxPermissionsGuard],
        component: UsersToolsComponent,
        data: {
          title: 'Tools',
          breadcrumb: 'Tools',
          permissions: {
            only: ['canSeeUsersToolsPage']
          }
        }
      }
    ]
  }
];
