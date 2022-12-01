import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPopUpComponent } from './user-pop-up.component';

xdescribe('UserPopUpComponent', () => {
  let component: UserPopUpComponent;
  let fixture: ComponentFixture<UserPopUpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPopUpComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
