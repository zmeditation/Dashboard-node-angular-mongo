import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetItSnowComponent } from './let-it-snow.component';

xdescribe('LetItSnowComponent', () => {
  let component: LetItSnowComponent;
  let fixture: ComponentFixture<LetItSnowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LetItSnowComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetItSnowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
