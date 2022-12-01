import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatOptionModule , MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { FlexLayoutModule } from '@angular/flex-layout';
import { UserSettingsComponent } from './user-profile/settings/user-settings.component';
import { RouterModule } from '@angular/router';
import { UsersProfileRoutes } from './user-profile.routing';
import { FileUploadModule } from 'ng2-file-upload';
import { StatisticsModule } from '../../../../wmg_modules/statistics/statistics.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { UserSettingsEditComponent } from './user-profile/settings/user-settings-edit/user-settings-edit.component';
import { UserAttachmentsComponent } from './user-profile/attachments/user-attachments.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SharedModule } from 'shared/shared.module';
import { ApiTokenGeneratorComponent } from './user-profile/api-token-generator/api-token-generator.component';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatExpansionModule,
    FlexLayoutModule,
    FileUploadModule,
    StatisticsModule,
    NgxDatatableModule,
    TranslateModule.forChild(),
    RouterModule.forChild(UsersProfileRoutes),
    NgxPermissionsModule
  ],
  declarations: [
    UserSettingsComponent,
    UserSettingsEditComponent,
    UserAttachmentsComponent,
    ApiTokenGeneratorComponent
  ]
})
export class UsersProfileModule {}
