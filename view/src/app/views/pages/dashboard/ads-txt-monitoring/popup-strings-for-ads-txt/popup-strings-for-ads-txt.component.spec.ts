import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupStringsForAdsTxtComponent } from './popup-strings-for-ads-txt.component';

xdescribe('PopupStringsForAdsTxtComponent', () => {
  let component: PopupStringsForAdsTxtComponent;
  let fixture: ComponentFixture<PopupStringsForAdsTxtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PopupStringsForAdsTxtComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupStringsForAdsTxtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
