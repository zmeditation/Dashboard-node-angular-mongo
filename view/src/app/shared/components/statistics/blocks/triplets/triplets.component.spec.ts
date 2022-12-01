import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TripletsComponent } from './triplets.component';

xdescribe('TripletsComponent', () => {
  let component: TripletsComponent;
  let fixture: ComponentFixture<TripletsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TripletsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TripletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
