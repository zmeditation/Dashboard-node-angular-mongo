import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeSelectComponent } from './notice-select.component';

describe('NoticeSelectComponent', () => {
  let component: NoticeSelectComponent;
  let fixture: ComponentFixture<NoticeSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticeSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticeSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
