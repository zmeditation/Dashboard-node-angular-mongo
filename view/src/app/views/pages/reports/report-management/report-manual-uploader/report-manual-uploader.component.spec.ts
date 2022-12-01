import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportManualUploaderComponent } from './report-manual-uploader.component';

xdescribe('ReportManualUploaderComponent', () => {
  let component: ReportManualUploaderComponent;
  let fixture: ComponentFixture<ReportManualUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportManualUploaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportManualUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
