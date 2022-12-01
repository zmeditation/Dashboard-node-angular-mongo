import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManualUploaderTableComponent } from './report-manual-uploader-table.component';

xdescribe('ReportManualUploaderTableComponent', () => {
  let component: ReportManualUploaderTableComponent;
  let fixture: ComponentFixture<ReportManualUploaderTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportManualUploaderTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManualUploaderTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
