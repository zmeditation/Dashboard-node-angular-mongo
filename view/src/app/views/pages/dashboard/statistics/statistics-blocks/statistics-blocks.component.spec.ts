import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsBlocksComponent } from './statistics-blocks.component';

xdescribe('StatisticsBlocksComponent', () => {
  let component: StatisticsBlocksComponent;
  let fixture: ComponentFixture<StatisticsBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsBlocksComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
