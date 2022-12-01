import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShowTagsDialogComponent } from './show-tags-dialog.component';

xdescribe('ShowTagsDialogComponent', () => {
  let component: ShowTagsDialogComponent;
  let fixture: ComponentFixture<ShowTagsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowTagsDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTagsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
