import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportViewerQueryBuilderDeliveryComponent } from './report-viewer-query-builder-delivery.component';

xdescribe('ReportViewerQueryBuilderDeliveryComponent', () => {
  let component: ReportViewerQueryBuilderDeliveryComponent;
  let fixture: ComponentFixture<ReportViewerQueryBuilderDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportViewerQueryBuilderDeliveryComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportViewerQueryBuilderDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
