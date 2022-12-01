import { TestBed } from '@angular/core/testing';

import { ReportTableFilterService } from './report-table-filter.service';

xdescribe('ReportTableFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportTableFilterService = TestBed.get(ReportTableFilterService);
    expect(service).toBeTruthy();
  });
});
