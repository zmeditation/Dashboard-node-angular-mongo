import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsPublishersConnectionComponent } from './statistics-publishers-connection.component';

describe('StatisticsPublishersConnectionComponent', () => {
  let component: StatisticsPublishersConnectionComponent;
  let fixture: ComponentFixture<StatisticsPublishersConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatisticsPublishersConnectionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsPublishersConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
