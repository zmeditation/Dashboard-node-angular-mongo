import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLastManualUploadsComponent } from './report-last-manual-uploads.component';

xdescribe('ReportLastManualUploadsComponent', () => {
  let component: ReportLastManualUploadsComponent;
  let fixture: ComponentFixture<ReportLastManualUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportLastManualUploadsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLastManualUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
