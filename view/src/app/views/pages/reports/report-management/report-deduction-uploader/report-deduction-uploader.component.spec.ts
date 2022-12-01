import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDeductionUploaderComponent } from './report-deduction-uploader.component';

xdescribe('ReportDeductionUploaderComponent', () => {
  let component: ReportDeductionUploaderComponent;
  let fixture: ComponentFixture<ReportDeductionUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDeductionUploaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDeductionUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
