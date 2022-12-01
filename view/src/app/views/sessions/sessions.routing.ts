import { Routes } from '@angular/router';
import { LockscreenComponent } from './lockscreen/lockscreen.component';
import { SigninComponent } from './sign-in/sign-in.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ErrorComponent } from './error/error.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

export const SessionsRoutes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  {
    path: '',
    children: [
      //   {
      //   path: 'signup',
      //   component: SignupComponent,
      //   data: { title: 'Signup' }
      // },
      {
        path: 'sign-in',
        component: SigninComponent,
        data: { title: 'SignIn' }
      },
      // , {
      //   path: 'forgot-password',
      //   component: ForgotPasswordComponent,
      //   data: { title: 'Forgot password' }
      // }
      {
        path: 'lockscreen',
        component: LockscreenComponent,
        data: { title: 'Lockscreen' }
      },
      {
        path: '404',
        component: NotFoundComponent,
        data: { title: 'Not Found' }
      },
      {
        path: '403',
        component: ForbiddenComponent,
        data: { title: 'Forbidden' }
      },
      {
        path: 'error',
        component: ErrorComponent,
        data: { title: 'Error' }
      }
    ]
  }
];
