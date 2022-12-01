import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsTopPublishersComponent } from './statistics-top-publishers.component';

xdescribe('StatisticsTopPublishersComponent', () => {
  let component: StatisticsTopPublishersComponent;
  let fixture: ComponentFixture<StatisticsTopPublishersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsTopPublishersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsTopPublishersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
