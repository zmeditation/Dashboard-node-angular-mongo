import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableStatisticsDomainsComponent } from './table-statistics-domains.component';

xdescribe('TableStatisticsDomainsComponent', () => {
  let component: TableStatisticsDomainsComponent;
  let fixture: ComponentFixture<TableStatisticsDomainsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableStatisticsDomainsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableStatisticsDomainsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
