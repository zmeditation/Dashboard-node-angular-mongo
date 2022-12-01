import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptersSelectComponent } from './adapters-select.component';

xdescribe('AdaptersSelectComponent', () => {
  let component: AdaptersSelectComponent;
  let fixture: ComponentFixture<AdaptersSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdaptersSelectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdaptersSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
