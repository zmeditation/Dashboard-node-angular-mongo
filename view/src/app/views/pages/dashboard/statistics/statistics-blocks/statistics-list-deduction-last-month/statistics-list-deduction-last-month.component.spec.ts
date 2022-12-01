import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { StatisticsListDeductionLastMonthComponent } from './statistics-list-deduction-last-month.component';
import { of } from 'rxjs';
import { AnalyticsEndpointsService } from '../../../../../../shared/services/cruds/analytics-endpoints.service';

describe('StatisticsListDeductionLastMonthComponent', () => {
  let component: StatisticsListDeductionLastMonthComponent;
  let fixture: ComponentFixture<StatisticsListDeductionLastMonthComponent>;
  let service;
  const returnValuesService = {
    error: null,
    publisherDeductions: [
      {
        date: {
          fromDate: '2020-11-30T00:00:00.000Z',
          toDate: '2020-11-30T00:00:00.000Z'
        },
        name: 'publisher_change',
        sumOfDeduction: -444
      }
    ],
    success: true
  };
  const serviseValues = {
    getApiDeduction(query) {
      return of(returnValuesService);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      declarations: [StatisticsListDeductionLastMonthComponent],
      providers: [{ provide: AnalyticsEndpointsService, useValue: serviseValues }]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(StatisticsListDeductionLastMonthComponent);
    component = fixture.componentInstance;
    service = fixture.debugElement.injector.get(AnalyticsEndpointsService);
    fixture.detectChanges();
  });

  it('shold create component StatisticsListDeductionLastMonthComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call dataForDesks and set params', () => {
    expect(component.topDeduction).toBeTruthy();
    expect(component.topDeduction).toBeInstanceOf(Array);
    expect(component.topDeduction.length).toBe(1);
  });
});
