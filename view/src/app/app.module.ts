import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material/core';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxPermissionsConfigurationStore, NgxPermissionsModule, NgxPermissionsStore, NgxRolesStore } from 'ngx-permissions';
import { RXBox } from 'rxbox';

import { HTTPInterceptor } from 'shared/interceptors/http.interceptor';

import { rootRouterConfig } from './app.routing';
import { SharedModule } from 'shared/shared.module';
import { AppComponent } from './app.component';

import { TokenInterceptor } from 'shared/interceptors/token.interceptor';
import { Oauth2callbackComponent } from './views/pages/bidder/dfpstart-screen/oauth2callback/oauth2callback.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, '/assets/i18n/', '.json?date=' + Date.now());
}

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule.forRoot(),
    NgxPermissionsModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(rootRouterConfig, { useHash: false })
  ],
  declarations: [AppComponent, Oauth2callbackComponent],
  providers: [
    NgxPermissionsStore,
    NgxRolesStore,
    NgxPermissionsConfigurationStore,
    // HTTP / Token interceptors
    { provide: HTTP_INTERCEPTORS, useClass: HTTPInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    // ANGULAR MATERIAL SLIDER FIX
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: RXBox, useClass: RXBox }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
