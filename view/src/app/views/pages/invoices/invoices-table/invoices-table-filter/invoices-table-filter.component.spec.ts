import { InvoicesTableFilterComponent } from './invoices-table-filter.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from 'shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { InvoicesModule } from '../../invoices.module';
import { DebugElement, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxPermissionsService, NgxPermissionsConfigurationService, NgxRolesService } from 'ngx-permissions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { testData } from 'shared/tests_materials/invoices_data';

describe('InvoiceTableFilterComponent', () => {
  let component: InvoicesTableFilterComponent;
  let fixture: ComponentFixture<InvoicesTableFilterComponent>;
  let el: DebugElement;
  // tslint:disable-next-line:prefer-const
  let translateService: TranslateService;
  // tslint:disable-next-line:prefer-const
  let router: Router;
  // tslint:disable-next-line:prefer-const
  let httpClient: HttpClient;
  const permissionsStub = {
    getPermissions: () => {}
  };
  const USE_CONFIGURATION_STORE = new InjectionToken('USE_CONFIGURATION_STORE');
  const USE_ROLES_STORE = new InjectionToken('USE_ROLES_STORE');
  const snack = {
    open: () => {}
  };
  /*  let http: HttpTestingController;
    http = TestBed.inject(HttpTestingController);*/

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        InvoicesModule,
        BrowserAnimationsModule
        // HttpClientTestingModule
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: TranslateService, useValue: translateService },
        { provide: HttpClient, useValue: httpClient },
        { provide: NgxPermissionsService, useValue: permissionsStub },
        {
          provide: NgxPermissionsConfigurationService,
          useValue: USE_CONFIGURATION_STORE
        },
        { provide: NgxRolesService, useValue: USE_ROLES_STORE },
        { provide: MatSnackBar, useValue: snack }
        // {provide: HttpTestingController, useValue: http}
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(InvoicesTableFilterComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
      });
  });

  it('Component should be created', () => {
    expect(component).toBeTruthy('Component not exist');
  });

  it('Component should have four statuses', () => {
    expect(component.statuses.length).toBe(4);
    expect(component.statuses).toMatch('approved');
  });

  it('Should correct parse form data', () => {
    const form = {
      managers: [testData.manager],
      period: {
        begin: '2020-12-01T00:00:00.000Z',
        end: '2020-12-31T00:00:00.000Z'
      },
      publishers: [testData.publisher]
    };

    const expectedData = {
      managers: ['5fe20f7f908754585419117a'],
      period: {
        begin: '2020-12-01',
        end: '2021-01-01'
      },
      publishers: ['5fe47d588acefd39cc2f7472']
    };

    const data = component.prepareReqData(form);
    expect(data).toEqual(expectedData);
  });

  /*  it('should open error snackbar if error',  () => {
      const snackbar = TestBed.inject(MatSnackBar);
      const spy = spyOn(snackbar, 'open');
      fixture.detectChanges();
      component.showError('error');
      expect(spy).toHaveBeenCalled();
    })*/
});
