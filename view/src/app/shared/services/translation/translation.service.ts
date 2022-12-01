import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { AvailableLang } from './types';

@Injectable({
  providedIn: 'root'
})
export class AppTranslationService {
  public langSubject = new Subject<string>();

  protected _lang = 'en';

  protected _existingLangs = ['en', 'ru', 'uk', 'es'];

  protected _availableLangs: AvailableLang[] = [
    {
      name: 'English',
      code: 'en'
    },
    {
      name: 'Russian',
      code: 'ru'
    },
    {
      name: 'Spanish',
      code: 'es'
    }
  ];

  public constructor(public translate: TranslateService) {}

  public get lang(): string {
    return this._lang;
  }

  public set lang(value: string) {
    this._lang = value;
    this.translate.use(value);
    this.langSubject.next(value);
  }

  public get existingLangs(): string[] {
    return this._existingLangs;
  }

  public get availableLangs(): AvailableLang[] {
    return this._availableLangs;
  }
}
