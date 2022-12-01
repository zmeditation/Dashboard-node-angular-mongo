import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiDeletionDialogComponent } from './api-deletion-dialog.component';

xdescribe('ApiDeletionDialogComponent', () => {
  let component: ApiDeletionDialogComponent;
  let fixture: ComponentFixture<ApiDeletionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiDeletionDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiDeletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
