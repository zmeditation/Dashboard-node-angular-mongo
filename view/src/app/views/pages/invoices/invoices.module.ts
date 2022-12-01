import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoicesComponent } from './invoices.component';
import { RouterModule } from '@angular/router';
import { InvoicesRoutes } from './invoices.routing';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvoicesTableComponent } from './invoices-table/invoices-table.component';
import { InvoicesTableFilterComponent } from './invoices-table/invoices-table-filter/invoices-table-filter.component';
import { InvoicesTableMainComponent } from './invoices-table/invoices-table-main/invoices-table-main.component';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { SatDatepickerModule, SatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from 'saturn-datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxPermissionsModule } from 'ngx-permissions';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectSearchModule } from 'shared/components/input/search/mat-select-search/mat-select-search.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DirectivesModule } from 'shared/directives/directives.module';
import { CustomFormsModule } from 'ngx-custom-validators';
import { CancelReasonDialogComponent } from './invoices-table/cancel-reason-dialog/cancel-reason-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { InvoiceDeleteConfirmComponent } from './invoices-table/invoices-table-main/invoice-delete-confirm/invoice-delete-confirm.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { RevenueComponent } from './revenue/revenue.component';
import { RevenueTableComponent } from './revenue/revenue-table/revenue-table.component';
import { RevenueManagementComponent } from './revenue/revenue-management/revenue-management.component';
import { RevenuePopupComponent } from './revenue/revenue-table/revenue-popup/revenue-popup.component';
import { MatTabsModule } from '@angular/material/tabs';
import { RevenueManualInputComponent } from './revenue/revenue-management/revenue-manual-input/revenue-manual-input.component';
import { RevenueForceUpdateComponent } from './revenue/revenue-management/revenue-force-update/revenue-force-update.component';
import { RevenueDeleteComponent } from './revenue/revenue-management/revenue-delete/revenue-delete.component';
import { UpdateCreateRevenueHelperComponent } from './revenue/revenue-management/update-create-revenue-helper/update-create-revenue-helper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InvoicesRoutes),
    FileUploadModule,
    MatButtonModule,
    FlexLayoutModule,
    MatIconModule,
    TranslateModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ReactiveFormsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxPermissionsModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSelectSearchModule,
    NgxDatatableModule,
    DirectivesModule,
    CustomFormsModule,
    MatDialogModule,
    DirectivesModule,
    MatProgressBarModule,
    MatTabsModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  declarations: [
    InvoicesComponent,
    AddInvoiceComponent,
    InvoicesTableComponent,
    InvoicesTableFilterComponent,
    InvoicesTableMainComponent,
    CancelReasonDialogComponent,
    InvoiceDeleteConfirmComponent,
    RevenueComponent,
    RevenueTableComponent,
    RevenueManagementComponent,
    RevenuePopupComponent,
    RevenueManualInputComponent,
    RevenueForceUpdateComponent,
    RevenueDeleteComponent,
    UpdateCreateRevenueHelperComponent
  ]
})
export class InvoicesModule {}
