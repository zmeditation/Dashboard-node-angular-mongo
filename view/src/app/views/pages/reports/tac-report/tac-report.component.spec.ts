import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TacReportComponent } from './tac-report.component';

xdescribe('TacReportComponent', () => {
  let component: TacReportComponent;
  let fixture: ComponentFixture<TacReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TacReportComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TacReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
