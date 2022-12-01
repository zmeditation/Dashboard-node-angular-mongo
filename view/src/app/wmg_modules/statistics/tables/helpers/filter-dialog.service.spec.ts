import { TestBed } from '@angular/core/testing';

import { FilterDialogService } from './filter-dialog.service';

xdescribe('FilterDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilterDialogService = TestBed.get(FilterDialogService);
    expect(service).toBeTruthy();
  });
});
