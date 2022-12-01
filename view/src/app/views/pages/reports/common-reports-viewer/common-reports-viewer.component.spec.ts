import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonReportsViewerComponent } from './common-reports-viewer.component';

xdescribe('CommonReportsViewerComponent', () => {
  let component: CommonReportsViewerComponent;
  let fixture: ComponentFixture<CommonReportsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonReportsViewerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonReportsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
