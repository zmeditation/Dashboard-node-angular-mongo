import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportFileUploaderComponent } from './report-file-uploader.component';

xdescribe('ReportFileUploaderComponent', () => {
  let component: ReportFileUploaderComponent;
  let fixture: ComponentFixture<ReportFileUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportFileUploaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportFileUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
