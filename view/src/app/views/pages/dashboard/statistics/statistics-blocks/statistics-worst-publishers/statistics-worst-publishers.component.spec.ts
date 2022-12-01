import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsWorstPublishersComponent } from './statistics-worst-publishers.component';

xdescribe('StatisticsWorstPublishersComponent', () => {
  let component: StatisticsWorstPublishersComponent;
  let fixture: ComponentFixture<StatisticsWorstPublishersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsWorstPublishersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsWorstPublishersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
