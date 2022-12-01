import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WbidReportComponent } from './wbid-report.component';

xdescribe('WbidReportComponent', () => {
  let component: WbidReportComponent;
  let fixture: ComponentFixture<WbidReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WbidReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WbidReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
