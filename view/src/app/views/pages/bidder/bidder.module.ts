// external dependencies
import { AlertModule } from 'shared/services/_alert';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';

// internal dependencies
import { BidderComponent } from './bidder.component';
import { AddPlacementComponent } from './actions/add-placement/add-placement.component';
import { DataTableComponent } from './data-table/data-table.component';
import { ShowHistoryDialogComponent } from './data-table/show-history-dialog.component';
import { ShowTagsDialogComponent } from './data-table/show-tags-dialog.component';
import { AdsTxtDialogComponent } from './data-table/ads-txt-dialog.component';
import { ShowTagsComponent } from './actions/show-tags/show-tags.component';
import { EditSiteDomainDialogComponent } from './data-table/edit-site-domain-dialog.component';
import { AdaptersSelectComponent } from './actions/adapters-select/adapters-select.component';
import { EditPlacementComponent } from './actions/edit-placement/edit-placement.component';
import { RouterModule } from '@angular/router';
import { BidderRoutes } from './bidder.routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DFPStartScreenComponent } from './dfpstart-screen/dfpstart-screen.component';
import { ConsoleComponent } from './console/console.component';
import { WaitForIntegrationComponent } from './dfpstart-screen/wait-for-integration/wait-for-integration.component';
import { AnalyticsSelectComponent } from './actions/analytics-select/analytics-select.component';
import { WbidChartsComponent } from './analytics/wbid-charts/wbid-charts.component';
import { StatisticsModule } from '../../../wmg_modules/statistics/statistics.module';
import { ChartsFilterComponent } from './analytics/wbid-charts/charts-filter/charts-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { MetricsSelectDialogComponent } from '../../../wmg_modules/statistics/tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-metrics/metrics-select-dialog/metrics-select-dialog.component';
import { TrialComponent } from './trial/trial.component';
import { DirectivesModule } from 'shared/directives/directives.module';
import { EditAdapterSettingsDialogComponent } from "./actions/edit-placement/edit-adapter-settings-dialog.component";
import { AnalyticsAdapterSettingsDialogComponent } from "./actions/analytics-select/analytics-adapter-settings-dialog.component";
import { AddMarketplaceDialogComponent } from "./actions/adapters-select/add-marketplace-dialog.component";

@NgModule({
  declarations: [
    BidderComponent,
    AddPlacementComponent,
    ShowTagsDialogComponent,
    ShowHistoryDialogComponent,
    DataTableComponent,
    EditSiteDomainDialogComponent,
    AdsTxtDialogComponent,
    ShowTagsComponent,
    AdaptersSelectComponent,
    EditPlacementComponent,
    EditAdapterSettingsDialogComponent,
    DFPStartScreenComponent,
    ConsoleComponent,
    WaitForIntegrationComponent,
    AnalyticsSelectComponent,
    AnalyticsAdapterSettingsDialogComponent,
    AddMarketplaceDialogComponent,
    WbidChartsComponent,
    ChartsFilterComponent,
    TrialComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    FormsModule,
    MatDividerModule,
    MatToolbarModule,
    MatProgressBarModule,
    NgxDatatableModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(BidderRoutes),
    NgxPermissionsModule.forChild(),
    MatTooltipModule,
    MatBadgeModule,
    MatRadioModule,
    FlexLayoutModule,
    AlertModule,
    StatisticsModule,
    TranslateModule.forChild(),
    MatTabsModule,
    MatDatepickerModule,
    MatListModule,
    DirectivesModule
  ],
  bootstrap: [BidderComponent],
  entryComponents: [
    AddPlacementComponent,
    MetricsSelectDialogComponent,
    EditSiteDomainDialogComponent,
    AdsTxtDialogComponent,
    ShowTagsDialogComponent,
    ShowHistoryDialogComponent,
    EditAdapterSettingsDialogComponent,
    AnalyticsAdapterSettingsDialogComponent,
    AddMarketplaceDialogComponent
  ]
})
export class BidderModule {}
