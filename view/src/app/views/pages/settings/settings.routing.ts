import { Routes } from '@angular/router';
import { PermissionsComponent } from './permissions/permissions.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UserProfileComponent } from 'shared/components/user-profile/user-profile.component';

export const SettingsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'permissions',
        canActivate: [NgxPermissionsGuard],
        component: PermissionsComponent,
        data: {
          title: 'Permissions',
          breadcrumb: 'Permissions',
          permissions: {
            only: ['canSeePermissionManager'],
            redirectTo: '/sessions/404'
          }
        }
      },
      { path: 'profile', redirectTo: 'profile/overview' },
      {
        path: 'profile',
        canActivate: [NgxPermissionsGuard],
        component: UserProfileComponent,
        loadChildren: () => import('./../users/user-profile/users-profile.module').then((m) => m.UsersProfileModule),
        // loadChildren: './../users/user-profile/users-profile.module#UsersProfileModule',
        data: {
          title: 'Profile',
          breadcrumb: 'Profile',
          permissions: {
            only: ['canSeeOwnProfilePage'],
            redirectTo: '/sessions/404'
          }
        }
      }
    ]
  }
];
