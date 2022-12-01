import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAttachmentsComponent } from './user-attachments.component';

xdescribe('AttachmentsComponent', () => {
  let component: UserAttachmentsComponent;
  let fixture: ComponentFixture<UserAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserAttachmentsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
