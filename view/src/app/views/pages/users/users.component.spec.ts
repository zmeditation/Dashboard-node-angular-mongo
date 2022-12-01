import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CrudService } from 'shared/services/cruds/crud.service';
import { UsersEndpointsInterceptorMock } from 'shared/services/cruds/users-endpoints-interceptor.mock';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';
import { AppConfirmService } from 'shared/services/app-confirm/app-confirm.service';
import { UsersComponent } from './users.component';

class UsersComponentTest extends UsersComponent {
  getRoles(): string[] {
    return this.roles;
  }
}

describe('UsersComponent', () => {
  let component: UsersComponentTest;
  let fixture: ComponentFixture<UsersComponentTest>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersComponentTest],
      providers: [
        CrudService,
        AppConfirmService,
        AppLoaderService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UsersEndpointsInterceptorMock,
          multi: true
        }
      ],
      imports: [MatDialogModule, MatSnackBarModule, RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponentTest);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetched roles', () => {
    expect(component.getRoles().length).toEqual(9);
  });
});
