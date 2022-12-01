import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewerQueryBuilderBasicComponent } from './report-viewer-query-builder-basic.component';

xdescribe('ReportViewerQueryBuilderBasicComponent', () => {
  let component: ReportViewerQueryBuilderBasicComponent;
  let fixture: ComponentFixture<ReportViewerQueryBuilderBasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewerQueryBuilderBasicComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewerQueryBuilderBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
