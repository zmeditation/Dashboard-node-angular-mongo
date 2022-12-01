import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule , MatOptionModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';

import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { CodesRoutes } from './codes.routing';
import { VideoBannersComponent } from './video-banners/video-banners.component';
import { LogoInserterComponent } from './logo-inserter/logo-inserter.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AdvertisingModule } from '../../../wmg_modules/advertising/advertising.module';
import { CodesGeneratorComponent } from './codes-generator/codes-generator.component';
import { CustomFormsModule } from 'ngx-custom-validators';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { StatisticsModule } from '../../../wmg_modules/statistics/statistics.module';
import { VideoPlayerGeneratorModule } from './video-player-generator/video-player-generator.module';
import { VastGeneratorComponent } from './vast-generator/vast-generator.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPermissionsModule } from 'ngx-permissions';
import { DirectivesModule } from 'shared/directives/directives.module';
import { AllPurposeCodeGeneratorComponent } from './all-purpose-code-generator/all-purpose-code-generator.component';
import { MatExpansionModule } from "@angular/material/expansion";
import { CodesListComponent } from './codes-list/codes-list.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    FlexLayoutModule,
    ChartsModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(CodesRoutes),
    TranslateModule.forChild(),
    AdvertisingModule,
    CustomFormsModule,
    MatTooltipModule,
    ClipboardModule,
    MatAutocompleteModule,
    StatisticsModule,
    VideoPlayerGeneratorModule,
    FileUploadModule,
    NgxPermissionsModule,
    DirectivesModule,
    MatExpansionModule
  ],
  declarations: [VideoBannersComponent, LogoInserterComponent, CodesGeneratorComponent, VastGeneratorComponent, AllPurposeCodeGeneratorComponent, CodesListComponent]
})
export class CodesModule {}
