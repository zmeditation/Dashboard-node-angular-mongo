import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsTxtMonitoringComponent } from './ads-txt-monitoring.component';

xdescribe('AdsTxtMonitoringComponent', () => {
  let component: AdsTxtMonitoringComponent;
  let fixture: ComponentFixture<AdsTxtMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdsTxtMonitoringComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdsTxtMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
