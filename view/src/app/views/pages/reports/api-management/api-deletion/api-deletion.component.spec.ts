import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDeletionComponent } from './api-deletion.component';

xdescribe('ApiDeletionComponent', () => {
  let component: ApiDeletionComponent;
  let fixture: ComponentFixture<ApiDeletionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiDeletionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
