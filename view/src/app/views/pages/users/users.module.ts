/** @format */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CustomFormsModule } from 'ngx-custom-validators';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// styles
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectSearchModule } from 'shared/components/input/search/mat-select-search/mat-select-search.module';
import { MatAutocompletePaginationModule } from 'shared/components/mat-autocomplete-pagination/mat-autocomplete-pagination.module';
// Directives
import { DirectivesModule } from 'shared/directives/directives.module';
// Components
import { UsersComponent } from './users.component';
import { UserPopUpComponent } from './user-pop-up/user-pop-up.component';
import { DomainAddFormComponent } from './user-pop-up/domain-add-form/domain-add-form.component';
import { UserAddFormComponent } from './user-pop-up/user-add-form/user-add-form.component';
import { CommissionFormComponent } from './user-pop-up/commission-form/commission-form.component';
import { PropertiesComponent } from './user-properties-page/properties/properties.component';
import { UserPropertiesPageComponent } from './user-properties-page/user-properties-page.component';
import { VacantPropertiesComponent } from './user-properties-page/vacant-properties/vacant-properties.component';
import { AddPropertyFormComponent } from './user-properties-page/add-property-form/add-property-form.component';
import { UsersToolsComponent } from './users-tools/users-tools.component';
import { ContactsComponent } from './users-tools/contacts/contacts.component';
import { ReportsUsersToolsComponent } from './users-tools/reports/reports.component';
import { ProgrammaticsReportsCountsTableComponent } from './users-tools/reports/programmatics-reports-counts-table/programmatics-reports-counts-table.component';
import { InfoTableComponent } from './users-tools/contacts/info-table/info-table.component';
import { UsersRoleTableComponent } from './users-role-table/users-role-table.component';
import { UsersSearchAddFormComponent } from './users-search-add-form/users-search-add-form.component';
import { UpdatePublisherAccountManagerComponent } from './user-pop-up/update-publisher-account-manager/update-publisher-account-manager.component';
// Providers
import { CrudService } from 'shared/services/cruds/crud.service';
import { CodesGeneratorFormService } from '../codes/codes-generator/code-generator-forms.service';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { AccountManagerEndpointsService } from 'shared/services/cruds/account-manager-endpoints.service';
import { CountReportsEndpointsService } from 'shared/services/cruds/count-reports-endpoints.service';
import { ReportsEndpointsService } from 'shared/services/cruds/reports-endpoins.service';
import { AppConfirmService } from 'shared/services/app-confirm/app-confirm.service';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';
import { DataTransitionService } from './_services-and-helpers/data-transition.service';
import { SharedModule } from 'shared/shared.module';
// Routing
import { UsersRoutes } from './users.routing';
import { RtbPartnersListComponent } from './users-tools/rtb-partners-list/rtb-partners-list.component';
import { AddRtbPartnerComponent } from './users-tools/add-rtb-partner/add-rtb-partner.component';
import { NoticeComponent } from './users-tools/notice/notice.component';
import { NoticeSelectComponent } from './users-tools/notice/notice-select/notice-select.component';
import { NoticeViewComponent } from './users-tools/notice/notice-view/notice-view.component';
import { SspEndpointComponent } from './users-tools/rtb-partners-list/ssp-endpoint/ssp-endpoint.component';
import { ClipboardModule } from "@angular/cdk/clipboard";

@NgModule({
  imports: [
    MatTabsModule,
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    MatInputModule,
    MatPaginatorModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSelectSearchModule,
    MatAutocompletePaginationModule,
    CustomFormsModule,
    NgxPermissionsModule.forChild(),
    RouterModule.forChild(UsersRoutes),
    TranslateModule.forChild(),
    MatSortModule,
    DirectivesModule,
    SharedModule,
    MatRadioModule,
    ClipboardModule
  ],
  providers: [
    CrudService,
    CodesGeneratorFormService,
    UsersEndpointsService,
    AccountManagerEndpointsService,
    CountReportsEndpointsService,
    ReportsEndpointsService,
    FormBuilder,
    DataTransitionService,
    AppConfirmService,
    AppLoaderService,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ],
  declarations: [
    AddPropertyFormComponent,
    CommissionFormComponent,
    ContactsComponent,
    ReportsUsersToolsComponent,
    ProgrammaticsReportsCountsTableComponent,
    DomainAddFormComponent,
    DomainAddFormComponent,
    InfoTableComponent,
    UsersComponent,
    UserAddFormComponent,
    UserPopUpComponent,
    UsersRoleTableComponent,
    UsersSearchAddFormComponent,
    UserPropertiesPageComponent,
    UsersToolsComponent,
    PropertiesComponent,
    VacantPropertiesComponent,
    RtbPartnersListComponent,
    AddRtbPartnerComponent,
    VacantPropertiesComponent,
    UpdatePublisherAccountManagerComponent,
    NoticeComponent,
    NoticeSelectComponent,
    NoticeViewComponent,
    SspEndpointComponent
  ],
  entryComponents: [UserPopUpComponent]
})
export class UsersModule {}
