import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBannersComponent } from './video-banners.component';

xdescribe('VideoBannersComponent', () => {
  let component: VideoBannersComponent;
  let fixture: ComponentFixture<VideoBannersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoBannersComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
