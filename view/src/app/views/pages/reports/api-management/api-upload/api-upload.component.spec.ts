import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiUploadComponent } from './api-upload.component';

xdescribe('ApiUploadComponent', () => {
  let component: ApiUploadComponent;
  let fixture: ComponentFixture<ApiUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ApiUploadComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
