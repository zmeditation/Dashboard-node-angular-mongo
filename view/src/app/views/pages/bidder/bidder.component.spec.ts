import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BidderComponent } from './bidder.component';

xdescribe('BidderComponent', () => {
  let component: BidderComponent;
  let fixture: ComponentFixture<BidderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BidderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
