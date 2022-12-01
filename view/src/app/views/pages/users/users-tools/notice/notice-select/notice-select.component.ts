import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CrudService } from 'shared/services/cruds/crud.service';
import { GetResponseType } from 'shared/types/response';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { _filterStrings } from 'shared/helpers/utils';
import { TransporterService } from 'shared/services/transporter.service';

type NoticeTitles = {
  titles: string[],
  notice_type: string
}

@Component({
  selector: 'app-notice-select',
  templateUrl: './notice-select.component.html',
  styleUrls: ['./notice-select.component.scss']
})
export class NoticeSelectComponent implements OnInit, OnDestroy {

  @ViewChild("autoGroup", { static: false }) selectValue;

  private noticeGroups = [];

  public noticesForForm: NoticeTitles[] = [];

  public titleNoticeForm: FormGroup = this._formBuilder.group({
    noticeGroup: this.noticesForForm
  });

  public titleGroupOptions: Observable<any>;

  private indexesOfNoticeTypes = {
    warning: 0,
    information: 1
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private crud: CrudService,
    private _formBuilder: FormBuilder,
    private transporter: TransporterService
  ) { }

  ngOnInit(): void {
    this.sendRequest();
    this.setObservableAutocomplete();
  }

  setObservableAutocomplete() {
    this.titleGroupOptions = this.titleNoticeForm.get('noticeGroup')!.valueChanges
      .pipe(
        startWith<string>(''),
        map((value) => this._filterGroup(value))
      );
  }

  private sendRequest() {
    const getNoticesTitles = this.crud.getNoticeList().subscribe((resp: GetResponseType) => {
      this.noticeGroups = this.sortDataByTypes(resp.data);
      this.noticesForForm = resp.data.map(el => {
        return {
          notice_type: el.type,
          titles: el.notices.map(title => title.title)
        }
      });
      this.setSubscriptionOnSelect();
      this.titleNoticeForm.get('noticeGroup').setValue('');
    });
    this.subscriptions.add(getNoticesTitles);
  }

  private setSubscriptionOnSelect() {
    const selectSubscription = this.selectValue.optionSelected.subscribe(value => {
      const type = this.indexesOfNoticeTypes[value.option.group.label];
      const title = value.option.value;
      const [ neededNotice ] = this.noticeGroups[type].notices.map(el => {
        if (el.title === title) {
          return el;
        }
      }).filter(el => el !== undefined);
      this.transportNoticeToView(neededNotice);
    });
    this.subscriptions.add(selectSubscription);
  }

  private _filterGroup(value: string) {
    if (value || '') {
      return this.noticesForForm
        .map(group => {
          return ({ notice_type: group.notice_type, titles: _filterStrings(group.titles, value) })
        })
        .filter(group => group.titles.length > 0);
    }
    return this.noticesForForm;
  }

  public clearValue() {
    this.titleNoticeForm.get('noticeGroup').reset();
    this.sendRequest();
  }

  public transportNoticeToView(notice) {
    this.transporter.transit(notice);
  }

  private sortDataByTypes(data) {
    return data.sort((a, b) => {
      if (a.type === 'warning') {
        return -1;
      }
      if (a.type !== 'warning') {
        return 1;
      }
      return 0
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.unsubscribe();
    }
  }
}
