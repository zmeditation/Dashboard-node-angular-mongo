import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTagsComponent } from './show-tags.component';

xdescribe('ShowTagsComponent', () => {
  let component: ShowTagsComponent;
  let fixture: ComponentFixture<ShowTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowTagsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
