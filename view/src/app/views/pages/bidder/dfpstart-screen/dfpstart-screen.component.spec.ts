import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DFPStartScreenComponent } from './dfpstart-screen.component';

xdescribe('DFPStartScreenComponent', () => {
  let component: DFPStartScreenComponent;
  let fixture: ComponentFixture<DFPStartScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DFPStartScreenComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DFPStartScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
