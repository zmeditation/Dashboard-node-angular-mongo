import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewerMainComponent } from './report-viewer-main.component';

xdescribe('ReportViewerMainComponent', () => {
  let component: ReportViewerMainComponent;
  let fixture: ComponentFixture<ReportViewerMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewerMainComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewerMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
