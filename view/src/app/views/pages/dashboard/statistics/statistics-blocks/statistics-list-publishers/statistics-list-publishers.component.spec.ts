import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsListPublishersComponent } from './statistics-list-publishers.component';

xdescribe('StatisticsListPublishersComponent', () => {
  let component: StatisticsListPublishersComponent;
  let fixture: ComponentFixture<StatisticsListPublishersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsListPublishersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsListPublishersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
