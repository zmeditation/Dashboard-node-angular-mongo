import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { NgxPermissionsModule } from 'ngx-permissions';

import { TestUsersService } from 'shared/services/user/test-users.service';
import { CrudService } from 'shared/services/cruds/crud.service';
import { DirectivesModule } from 'shared/directives/directives.module';

import { DashboardRoutes } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { MessageCardComponent } from './message-card/message-card.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AdsTxtMonitoringComponent } from './ads-txt-monitoring/ads-txt-monitoring.component';
import { PopupStringsForAdsTxtComponent } from './ads-txt-monitoring/popup-strings-for-ads-txt/popup-strings-for-ads-txt.component';
import { TableStatisticsDomainsComponent } from './ads-txt-monitoring/table-domains-statistics/table-statistics-domains.component';
import { StatisticsBlocksComponent } from './statistics/statistics-blocks/statistics-blocks.component';
import { StatisticsTopPublishersComponent } from './statistics/statistics-blocks/statistics-top-publishers/statistics-top-publishers.component';
import { StatisticsWorstPublishersComponent } from './statistics/statistics-blocks/statistics-worst-publishers/statistics-worst-publishers.component';
import { StatisticsListPublishersComponent } from './statistics/statistics-blocks/statistics-list-publishers/statistics-list-publishers.component';
import { StatisticsPublishersConnectionComponent } from './statistics/statistics-blocks/statistics-publishers-connection/statistics-publishers-connection.component';
import { ProgrammaticsFilterComponent } from './ads-txt-monitoring/programmatics-filter/programmatics-filter.component';
import { StatisticsListDeductionLastMonthComponent } from './statistics/statistics-blocks/statistics-list-deduction-last-month/statistics-list-deduction-last-month.component';
import { DashboardDialogComponent } from './dashboard-dialog/dashboard-dialog.component';
import { ConnectionDialog } from './statistics/statistics-blocks/statistics-publishers-connection/connection-dialog/connection-dialog.component';
import { StatisticsModule } from '../../../wmg_modules/statistics/statistics.module';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatChipsModule,
    MatDialogModule,
    MatListModule,
    MatGridListModule,
    MatCheckboxModule,
    FlexLayoutModule,
    ChartsModule,
    NgxDatatableModule,
    StatisticsModule,
    NgxPermissionsModule.forChild(),
    TranslateModule.forChild(),
    RouterModule.forChild(DashboardRoutes),
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatAutocompleteModule,
    DirectivesModule
  ],
  providers: [CrudService, TestUsersService],
  declarations: [
    DashboardComponent,
    MessageCardComponent,
    StatisticsComponent,
    AdsTxtMonitoringComponent,
    PopupStringsForAdsTxtComponent,
    TableStatisticsDomainsComponent,
    StatisticsBlocksComponent,
    StatisticsTopPublishersComponent,
    StatisticsWorstPublishersComponent,
    StatisticsListPublishersComponent,
    ProgrammaticsFilterComponent,
    StatisticsListDeductionLastMonthComponent,
    DashboardDialogComponent,
    StatisticsPublishersConnectionComponent,
    ConnectionDialog
  ],
  entryComponents: [PopupStringsForAdsTxtComponent]
})
export class DashboardModule {}
