import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsersEndpointsInterceptorMock } from 'shared/services/cruds/users-endpoints-interceptor.mock';
import { UserGetUsersResponseType as User } from 'shared/services/cruds/type';
import { UsersRoleTableComponent } from './users-role-table.component';

class UsersRoleTableComponentTest extends UsersRoleTableComponent {
  public getTableData(): User[] {
    return this.tableData;
  }
}

describe('UsersRoleTable', () => {
  let component: UsersRoleTableComponentTest;
  let fixture: ComponentFixture<UsersRoleTableComponentTest>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UsersRoleTableComponentTest],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: UsersEndpointsInterceptorMock,
          multi: true
        }
      ],
      imports: [HttpClientTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersRoleTableComponentTest);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetched table data', () => {
    expect(component.getTableData().length).toEqual(10);
  });
});
