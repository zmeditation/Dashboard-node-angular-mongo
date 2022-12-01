import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommissionFormComponent } from './commission-form.component';
import { FormBuilder } from '@angular/forms';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { DataTransitionService } from '../../_services-and-helpers/data-transition.service';
import { USERS } from 'shared/tests_materials/export.service';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import * as ru from 'assets/i18n/ru.json';
import * as en from 'assets/i18n/en.json';

const translations: any = {
  EN: en,
  RU: ru
};

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<any> {
    const uppercased = lang.toUpperCase();
    return Observable.of(translations[uppercased]);
  }
}

describe('CommissionFormComponent', () => {
  let component: CommissionFormComponent;
  let fixture: ComponentFixture<CommissionFormComponent>;
  let permissionsService: NgxPermissionsService;
  let el: DebugElement, translate: TranslateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxPermissionsModule.forChild(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: FakeLoader
          }
        })
      ],
      declarations: [CommissionFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [FormBuilder, { provide: NgxPermissionsService, useValue: permissionsService }, DataTransitionService, TranslateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommissionFormComponent);
    component = fixture.componentInstance;
    permissionsService = TestBed.inject(NgxPermissionsService);
    translate = TestBed.inject(TranslateService);
    translate.use('en');
    component.User = USERS.users[0];
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('CommissionFormComponent should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build form of commission', () => {
    const form = component.buildCommissionForm();
    expect(form).toBeTruthy('Form is not built');
  });

  it('should be created a wrapper', () => {
    const wrapper = el.query(By.css('.wrapper-commission-form')),
      title = el.query(By.css('.title-of-form'));
    fixture.detectChanges();
    console.log(title);
    expect(wrapper).toBeTruthy('Could not find a main div');

    expect(title).toBeTruthy('Could not find a title tag');
    expect(title.nativeElement.textContent.trim()).toBe('Commission', 'Could not find a title tag');
  });
});
