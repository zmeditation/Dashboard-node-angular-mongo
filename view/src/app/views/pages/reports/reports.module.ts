/** @format */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatRippleModule , MatOptionModule , MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

import { NgxPermissionsModule } from 'ngx-permissions';
import { FileUploadModule } from 'ng2-file-upload';
import { ChartsModule } from 'ng2-charts';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { SharedModule } from 'shared/shared.module';
import { DirectivesModule } from 'shared/directives/directives.module';

import { ReportsRoutes } from './reports.routing';

import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { ReportViewerMainComponent } from './report-viewer/report-viewer-main/report-viewer-main.component';
import { TemporaryMessageErrorComponent } from './report-viewer/temporary-message-error/temporary-message-error.component';

import { ReportManualUploaderTableComponent } from './report-management/report-manual-uploader/report-manual-uploader-table/report-manual-uploader-table.component';
import { ReportManagementComponent } from './report-management/report-management.component';
import { ReportFileUploaderComponent } from './report-management/report-file-uploader/report-file-uploader.component';
import { ReportManualUploaderComponent } from './report-management/report-manual-uploader/report-manual-uploader.component';
import { ReportLastManualUploadsComponent } from './report-management/report-manual-uploader/report-last-manual-uploads/report-last-manual-uploads.component';
import { ReportDeductionUploaderComponent } from './report-management/report-deduction-uploader/report-deduction-uploader.component';

import { MetricsSelectDialogComponent } from '../../../wmg_modules/statistics/tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-metrics/metrics-select-dialog/metrics-select-dialog.component';
import { StatisticsModule } from '../../../wmg_modules/statistics/statistics.module';

import { ApiManagementComponent } from './api-management/api-management.component';
import { ApiDeletionComponent } from './api-management/api-deletion/api-deletion.component';
import { ApiUploadComponent } from './api-management/api-upload/api-upload.component';
import { ApiDeletionDialogComponent } from './api-management/api-deletion/api-deletion-dialog/api-deletion-dialog.component';
import { ApiUploadDialogComponent } from './api-management/api-upload/api-upload-dialog/api-upload-dialog.component';

import { TacReportComponent } from './tac-report/tac-report.component';
import { WbidReportComponent } from './wbid-report/wbid-report.component';
import { CommonReportsViewerComponent } from './common-reports-viewer/common-reports-viewer.component';
import { OrtbReportComponent } from './ortb-report/ortb-report.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatTableModule,
    MatOptionModule,
    MatSelectModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatTooltipModule,
    FlexLayoutModule,
    ChartsModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    StatisticsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(ReportsRoutes),
    TranslateModule.forChild(),
    SharedModule,
    DirectivesModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  declarations: [
    ApiManagementComponent,
    ApiDeletionComponent,
    ApiUploadComponent,
    ApiDeletionDialogComponent,
    ApiUploadDialogComponent,
    CommonReportsViewerComponent,
    ReportViewerComponent,
    ReportManagementComponent,
    ReportFileUploaderComponent,
    ReportManualUploaderComponent,
    ReportViewerMainComponent,
    ReportManualUploaderTableComponent,
    ReportLastManualUploadsComponent,
    TemporaryMessageErrorComponent,
    ReportDeductionUploaderComponent,
    TacReportComponent,
    WbidReportComponent,
    OrtbReportComponent
  ],
  exports: [],
  entryComponents: [
    MetricsSelectDialogComponent,
    ApiDeletionDialogComponent,
    ApiUploadDialogComponent,
    TemporaryMessageErrorComponent
  ]
})
export class ReportsModule {}
