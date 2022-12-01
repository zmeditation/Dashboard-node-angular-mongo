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
import { MatRippleModule , MatOptionModule , MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';

import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MainChartComponent } from './charts/main-chart/main-chart.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ReportTableComponent } from './tables/report-table/report-table/report-table.component';
import { MainFilterComponent } from './main-filter/main-filter.component';
import { ReportChartComponent } from './charts/report-chart/report-chart.component';
import { StatisticsChartComponent } from './charts/statistics-chart/statistics-chart.component';
import { AnalyticTableComponent } from './tables/analytic-table/analytic-table.component';
import { WbidAnalyticsChartsComponent } from './charts/wbid-analytics-charts/wbid-analytics-charts.component';
import { ReportViewerQueryBuilderComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder.component';
import { ReportViewerQueryResultComponent } from './tables/reports-builder/report-viewer-query-result/report-viewer-query-result.component';
import { FiltersDialogComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-dialog.component';
import { FiltersAmListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-am-list/filters-am-list.component';
import { FiltersPlacementListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-placement-list/filters-placement-list.component';
import { FiltersPubListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-pub-list/filters-pub-list.component';
import { FiltersGenericListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-generic-list/filters-generic-list.component';
import { MetricsSelectDialogComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-metrics/metrics-select-dialog/metrics-select-dialog.component';
import { ReportViewerQueryBuilderDeliveryComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-delivery/report-viewer-query-builder-delivery.component';
import { ReportViewerQueryBuilderDimensionsComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-dimensions/report-viewer-query-builder-dimensions.component';
import { ReportViewerQueryBuilderFiltersComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/report-viewer-query-builder-filters.component';
import { ReportViewerQueryBuilderMetricsComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-metrics/report-viewer-query-builder-metrics.component';
import { ReportViewerQueryBuilderBasicComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-basic/report-viewer-query-builder-basic.component';
import { SharedModule } from 'shared/shared.module';
import { FiltersCountriesListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-countries-list/filters-countries-list.component';
import { FiltersBiddersListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-bidders-list/filters-bidders-list.component';
import { FiltersSitesListComponent } from './tables/reports-builder/report-viewer-query-builder/report-viewer-query-builder-filters/filters-dialog/filters-sites-list/filters-sites-list.component';
import { ReportViewerQueryPublishersDeductionComponent } from './tables/reports-builder/report-viewer-query-publishers-deduction/report-viewer-query-publishers-deduction.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableExporterModule } from 'mat-table-exporter';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
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
    MatCheckboxModule,
    MatRadioModule,
    MatTabsModule,
    MatOptionModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    MatTableModule,
    MatDialogModule,
    MatButtonToggleModule,
    FlexLayoutModule,
    ChartsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgxPermissionsModule.forChild(),
    MatProgressBarModule,
    SharedModule,
    MatToolbarModule,
    MatTableExporterModule
  ],
  exports: [
    MainChartComponent,
    ReportTableComponent,
    MainFilterComponent,
    ReportChartComponent,
    StatisticsChartComponent,
    AnalyticTableComponent,
    WbidAnalyticsChartsComponent,
    ReportViewerQueryBuilderComponent,
    ReportViewerQueryResultComponent,
    ReportViewerQueryPublishersDeductionComponent
  ],
  declarations: [
    MainChartComponent,
    ReportTableComponent,
    MainFilterComponent,
    ReportChartComponent,
    StatisticsChartComponent,
    AnalyticTableComponent,
    WbidAnalyticsChartsComponent,
    ReportViewerQueryBuilderComponent,
    ReportViewerQueryResultComponent,
    ReportViewerQueryBuilderBasicComponent,
    ReportViewerQueryBuilderMetricsComponent,
    ReportViewerQueryBuilderFiltersComponent,
    ReportViewerQueryBuilderDimensionsComponent,
    ReportViewerQueryBuilderDeliveryComponent,
    MetricsSelectDialogComponent,
    FiltersDialogComponent,
    FiltersGenericListComponent,
    FiltersPubListComponent,
    FiltersPlacementListComponent,
    FiltersAmListComponent,
    FiltersCountriesListComponent,
    FiltersBiddersListComponent,
    FiltersSitesListComponent,
    ReportViewerQueryPublishersDeductionComponent
  ],
  entryComponents: [FiltersDialogComponent]
})
export class StatisticsModule {}
