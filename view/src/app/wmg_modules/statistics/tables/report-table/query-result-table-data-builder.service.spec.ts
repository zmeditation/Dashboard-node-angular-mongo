import { TestBed } from '@angular/core/testing';

import { QueryResultTableDataBuilderService } from './query-result-table-data-builder.service';

xdescribe('QueryResultTableDataBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QueryResultTableDataBuilderService = TestBed.get(QueryResultTableDataBuilderService);
    expect(service).toBeTruthy();
  });
});
