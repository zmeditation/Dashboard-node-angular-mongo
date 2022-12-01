import { TestBed } from '@angular/core/testing';

import { ReportViewerQueryBuilderService } from './report-viewer-query-builder.service';

xdescribe('ReportViewerQueryBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportViewerQueryBuilderService = TestBed.get(ReportViewerQueryBuilderService);
    expect(service).toBeTruthy();
  });
});
