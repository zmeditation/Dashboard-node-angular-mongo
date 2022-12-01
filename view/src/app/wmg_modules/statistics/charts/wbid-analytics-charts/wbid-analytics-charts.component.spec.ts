import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WbidAnalyticsChartsComponent } from './wbid-analytics-charts.component';

xdescribe('WbidAnalyticsChartsComponent', () => {
  let component: WbidAnalyticsChartsComponent;
  let fixture: ComponentFixture<WbidAnalyticsChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WbidAnalyticsChartsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WbidAnalyticsChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
