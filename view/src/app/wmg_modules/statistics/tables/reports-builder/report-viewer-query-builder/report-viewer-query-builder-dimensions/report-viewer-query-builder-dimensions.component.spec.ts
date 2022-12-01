import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewerQueryBuilderDimensionsComponent } from './report-viewer-query-builder-dimensions.component';

xdescribe('ReportViewerQueryBuilderDimensionsComponent', () => {
  let component: ReportViewerQueryBuilderDimensionsComponent;
  let fixture: ComponentFixture<ReportViewerQueryBuilderDimensionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewerQueryBuilderDimensionsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewerQueryBuilderDimensionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
