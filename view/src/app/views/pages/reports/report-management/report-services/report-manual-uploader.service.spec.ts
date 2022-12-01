import { TestBed } from '@angular/core/testing';

import { ReportManualUploaderService } from './report-manual-uploader.service';

xdescribe('ReportManualUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportManualUploaderService = TestBed.get(ReportManualUploaderService);
    expect(service).toBeTruthy();
  });
});
