import { GetDataQuery } from './get-data-query';
import { FormGroup } from '@angular/forms';
import { User } from 'shared/interfaces/common.interface';

export class ConfigInputUsers extends GetDataQuery {
  usersFromDB: Array<any> = [];

  domainsFromDB: Array<any> = [];

  selectedDomains = [];

  listFilteredDomains: { domain: string; selected: boolean }[] = [];

  displaySelectedDomains = [];

  showClearCheckListDomains = false;

  lastFilter = '';

  showClearCheckList = false;

  selectedUsers: string[] = [];

  allSelectedUsersObj: User[] = [];

  displaySelectedUsers: string[] = [];

  inputFilterForm: FormGroup;

  showFilterTypeSelect = true;

  objectReadyToSend: any = {
    request: {
      type: 'analytics',
      range: 'lastSevenDays',
      interval: 'daily',
      fillMissing: true,
      customRange: {
        dateFrom: '',
        dateTo: ''
      },
      metrics: ['impressions', 'clicks', 'ctr', 'revenue', 'cpm', 'requests', 'fillrate'],
      filters: [],
      dimensions: ['daily']
    }
  };

  filter(filter) {
    this.lastFilter = filter;
    if (filter) {
      return this.usersFromDB.filter((option) => {
        return option.name.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
      });
    } else { return this.usersFromDB.slice(); }

  }

  toggleSelection(user: User, reportType?: string) {
    user.selected = !user.selected;

    if (user.selected) {
      this.selectedUsers.push(user.id);
      this.allSelectedUsersObj.push(user);

      if (user.domains) {
        for (const dom of user.domains) {
          this.listFilteredDomains.push({
            domain: dom,
            selected: false
          });
        }
      }

      if (this.selectedUsers.length === 0) {
        this.objectReadyToSend.request.filters = [];
        this.inputFilterForm.get('domainsForm').setValue('All domains');
        this.showClearCheckListDomains = false;
        this.inputFilterForm.controls.domainsForm.disable();
      } else if (this.selectedUsers.length > 0) {
        this.inputFilterForm.get('domainsForm').setValue(this.displaySelectedDomains);
        reportType !== 'oRTB' ? this.inputFilterForm.controls.domainsForm.enable() : this.inputFilterForm.controls.domainsForm.disable();
        this.objectReadyToSend.request.filters[0] = {
          filterId: '63508',
          values: this.selectedUsers,
          type: 'include'
        };
        this.displaySelectedUsers.push(user.name.replace('', ' '));
        this.showClearCheckList = true;
      }
    } else {
      // удаление объекта юзера из списков для инпута для паблишеров

      const i = this.selectedUsers.findIndex((value) => value === user.id);
      this.selectedUsers.splice(i, 1);
      this.displaySelectedUsers.splice(i, 1);
      this.allSelectedUsersObj.splice(i, 1);

      // удаление доменов из списков для инпута для доменов соответствующих паблишеров
      if (user.domains) {
        for (const dom of user.domains) {
          const j = this.selectedDomains.findIndex((value) => value === dom);
          if (this.selectedDomains.indexOf(dom) !== -1) {
            this.selectedDomains.splice(j, 1);
            this.displaySelectedDomains.splice(j, 1);
          }
          for (const li of this.listFilteredDomains) {
            if (li.domain === dom) {
              this.listFilteredDomains.splice(this.listFilteredDomains.indexOf(li), 1);
            }
          }
        }
      }

      this.inputFilterForm.get('domainsForm').setValue(this.displaySelectedDomains);
      if (this.selectedUsers.length === 0) {
        this.objectReadyToSend.request.filters = [];
        this.inputFilterForm.get('domainsForm').setValue('All domains');
        this.inputFilterForm.controls.domainsForm.disable();
      }
      if (this.displaySelectedUsers.length === 0) { this.showClearCheckList = false; }

    }
    this.inputFilterForm.get('usersForm').setValue(this.displaySelectedUsers);
    this.inputFilterForm.get('oRTBUsersForm').setValue(this.displaySelectedUsers);
  }

  PrepareObject(val, reportType?) {
    if (val.name && val.id) { this.toggleSelection(val, reportType); }

    if (val.day) { this.objectReadyToSend.request.range = val.day; }

    if (val.query) { this.objectReadyToSend.request.interval = val.query.toLowerCase(); }

    this.objectReadyToSend.request.interval === 'total' ? (this.showFilterTypeSelect = false) : (this.showFilterTypeSelect = true);

    this.objectReadyToSend.request.interval === 'total'
      ? (this.objectReadyToSend.request.dimensions = [])
      : (this.objectReadyToSend.request.dimensions = ['daily']);
  }

  clearInputChecks(checked: any) {
    for (const check of checked) { check.selected = false; }

    this.displaySelectedUsers = [];
    this.selectedUsers = [];
    this.allSelectedUsersObj = [];
    this.inputFilterForm.get('usersForm').setValue('All publishers');
    this.inputFilterForm.get('oRTBUsersForm').setValue('All publishers');
    this.inputFilterForm.get('domainsForm').setValue('All domains');
    this.inputFilterForm.get('domainsForm').disable();
    this.showClearCheckList = false;
    this.showClearCheckListDomains = false;
    this.listFilteredDomains = [];
    this.displaySelectedDomains = [];
    this.selectedDomains = [];
    this.objectReadyToSend.request.filters = [];
  }

  clearFormInputUsers() {
    this.inputFilterForm.controls.usersForm.setValue('');
    this.inputFilterForm.controls.oRTBUsersForm.setValue('');
  }

  optionClicked(event, user, reportType?) {
    event.stopPropagation();
    this.PrepareObject(user, reportType);
  }
}
