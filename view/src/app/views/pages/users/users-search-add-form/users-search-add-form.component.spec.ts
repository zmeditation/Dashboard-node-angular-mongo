import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { UsersSearchAddFormComponent } from './users-search-add-form.component';

describe('UsersSearchAddForm', () => {
  let component: UsersSearchAddFormComponent;
  let fixture: ComponentFixture<UsersSearchAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersSearchAddFormComponent],
      imports: [
        TranslateModule.forRoot(),
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersSearchAddFormComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
