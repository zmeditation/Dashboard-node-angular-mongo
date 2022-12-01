import { TestBed } from '@angular/core/testing';

import { ReportServiceDataService } from './report-service-data.service';

xdescribe('ReportServiceDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReportServiceDataService = TestBed.get(ReportServiceDataService);
    expect(service).toBeTruthy();
  });
});
