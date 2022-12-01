import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiUploadDialogComponent } from './api-upload-dialog.component';

xdescribe('ApiUploadDialogComponent', () => {
  let component: ApiUploadDialogComponent;
  let fixture: ComponentFixture<ApiUploadDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiUploadDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiUploadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
