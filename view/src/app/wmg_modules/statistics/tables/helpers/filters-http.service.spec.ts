import { TestBed } from '@angular/core/testing';

import { FiltersHttpService } from './filters-http.service';

xdescribe('FiltersHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FiltersHttpService = TestBed.get(FiltersHttpService);
    expect(service).toBeTruthy();
  });
});
