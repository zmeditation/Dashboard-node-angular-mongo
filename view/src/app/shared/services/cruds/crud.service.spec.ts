import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CrudService } from 'shared/services/cruds/crud.service';
import { TestBed } from '@angular/core/testing';
import { USERS, ROLES, PUBLISHERS, PROGRAMMATICS, FREE_PUBLISHERS, FREE_AM, ADS_TXT_MONITORING, EMAILS } from 'shared/tests_materials/export.service';
import { reqData, testData } from 'shared/tests_materials/invoices_data';
import { Invoice } from 'shared/interfaces/common.interface';
import exp from 'constants';

describe('CrudService', () => {
  let crudService: CrudService, httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CrudService]
    });
    crudService = TestBed.inject(CrudService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should get list of users', () => {
    crudService.getUsers({}).subscribe((data) => {
      expect(data).toBeTruthy();
      expect(data.users[0].email.length).toBeGreaterThan(2);
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/users/get');
    req.flush(USERS);
  });

  it('should get list of publishers only', () => {
    crudService.getUsers({}).subscribe((data) => {
      expect(data).toBeTruthy();
      const isPublishersOnly = data.users.some((el) => {
        return el.role === 'PUBLISHER';
      });
      expect(isPublishersOnly).toBeTrue();
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/users/get?u=PUBLISHER');
    req.flush(PUBLISHERS);
  });

  it('should get roles', () => {
    crudService.getRoles().subscribe((data) => {
      expect(data).toBeTruthy();

      expect(data.roles.length).toEqual(9);
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/users/roles');
    req.flush(ROLES);
  });

  it('should get list of programmatics', () => {
    crudService.getOriginProperties().subscribe((data) => {
      expect(data).toBeTruthy();

      expect(data.results.length).toEqual(21);

      expect(data.results.includes('Google Ad Manager')).toBeTrue();
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/reports/filters/31583');
    req.flush(PROGRAMMATICS);
  });

  it('should get list of publishers without references to manager', () => {
    crudService.getFreeUsers('publisher').subscribe((data: any) => {
      expect(data).toBeTruthy();
      const isNoRefUsersOnly = data.users.some((el) => {
        return el.am === null && el.sam === null;
      });
      expect(isNoRefUsersOnly).toBeTrue();

      const isPubUsersOnly = data.users.some((el) => {
        return el.role === 'PUBLISHER';
      });
      expect(isPubUsersOnly).toBeTrue();
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/users/get?u=PUBLISHER&noRef=true');
    req.flush(FREE_PUBLISHERS);
  });

  it('should get list of account managers without references to SAM', () => {
    crudService.getFreeUsers().subscribe((data: any) => {
      expect(data).toBeTruthy();

      const isNoRefUsersOnly = data.users.some((el) => {
        return el.sam === null;
      });
      expect(isNoRefUsersOnly).toBeTrue();

      const isAMUsersOnly = data.users.some((el) => {
        return el.role === 'ACCOUNT MANAGER';
      });
      expect(isAMUsersOnly).toBeTrue();
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/users/get?u=ACCOUNT MANAGER&noRef=true');
    req.flush(FREE_AM);
  });


  it('should get list checked domains on ads.txt', () => {
    crudService.getEmailsList().subscribe((data: Array<Object>) => {
      expect(data).toBeTruthy();

      const onlyTwoFields = data.some((el) => {
        const fields = Object.keys(el);
        return fields.includes('name') && fields.includes('email');
      });
      expect(onlyTwoFields).toBeTrue();
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/users/publishers-emails');
    req.flush(EMAILS);
  });

  it('should gel all invoices', () => {
    crudService.getInvoices(reqData).subscribe((data: Invoice[]) => {
      expect(data).toBeTruthy();
      expect(data.length).toEqual(1);
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/invoice/get');
    req.flush([testData.invoice]);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(reqData);
  });

  it('should change invoice status', () => {
    const id = testData.invoice._id;
    const status = 'pending';
    const publisher = testData.publisher.id;
    crudService.changeInvoiceStatus(id, status, publisher).subscribe((data: Invoice) => {
      expect(data).toBeTruthy();
      expect(data._id).toEqual(id);
    });
    const req = httpTestingController.expectOne(`http://localhost:4845/api/invoice/${ id }`);
    req.flush(testData.invoice);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body.status).toEqual(status);
    expect(req.request.responseType).toEqual('json');
  });

  it('should download invoice example', () => {
    crudService.loadExample().subscribe((data: Blob) => {
      expect(data).toBeTruthy();
    });
    const req = httpTestingController.expectOne('http://localhost:4845/api/invoice/example');
    req.flush(new Blob());
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('blob');
  });

  it('should download invoice by id', () => {
    const id = testData.invoice._id;
    crudService.downloadInvoice(id).subscribe((data: Blob) => {
      expect(data).toBeTruthy();
    });
    const req = httpTestingController.expectOne(`http://localhost:4845/api/invoice/${ id }`);
    req.flush(new Blob());
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toEqual('blob');
  });

  it('should delete invoice by id', () => {
    const id = testData.invoice._id;
    crudService.deleteInvoice(id).subscribe((data: Invoice) => {
      expect(data).toBeTruthy();
      expect(data._id).toEqual(id);
    });
    const req = httpTestingController.expectOne(`http://localhost:4845/api/invoice/${ id }`);
    req.flush(testData.invoice);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.responseType).toBe('json');
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
