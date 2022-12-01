import { ConfigInputUsers } from './config-input-users';

export class ConfigInputDomains extends ConfigInputUsers {
  lastFilterDomain = '';

  filterForDomains(filter) {
    this.lastFilterDomain = filter;

    if (filter && this.allSelectedUsersObj.length > 0) {
      return this.listFilteredDomains.filter((option) => {
        if (option.domain) {
          return option.domain.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        }
      });
    } else if (filter) {
      return this.domainsFromDB.filter((option) => {
        if (option.domain && typeof option.domain === 'string') {
          return option.domain.toLowerCase().indexOf(filter.toLowerCase()) >= 0;
        }
      });
    } else if (this.allSelectedUsersObj.length > 0) {
      return this.listFilteredDomains.slice();
    } else {
      return this.domainsFromDB.slice();
    }
  }

  toggleSelectionDomains(domain) {
    domain.selected = !domain.selected;
    if (domain.selected) {
      this.selectedDomains.push(domain.domain);

      if (this.selectedDomains.length === 0 && this.selectedUsers.length === 0) {
        this.objectReadyToSend.request.filters = [];
      } else if (this.selectedDomains.length > 0 && this.byReportsPerm === false) {
        this.objectReadyToSend.request.filters[0] = {
          filterId: '97677',
          values: this.selectedDomains,
          type: 'include'
        };
        this.displaySelectedDomains.push(domain.domain.replace('', ' '));
        this.showClearCheckListDomains = true;
      } else if (this.selectedDomains.length > 0) {
        this.objectReadyToSend.request.filters[1] = {
          filterId: '97677',
          values: this.selectedDomains,
          type: 'include'
        };
        this.displaySelectedDomains.push(domain.domain.replace('', ' '));
        this.showClearCheckListDomains = true;
      }
    } else {
      const ii = this.selectedDomains.findIndex((value) => value === domain.domain);
      this.selectedDomains.splice(ii, 1);
      this.displaySelectedDomains.splice(ii, 1);

      if (this.displaySelectedDomains.length === 0) {
        this.showClearCheckListDomains = true;
      }

      this.showClearCheckListDomains = true;
    }
    this.inputFilterForm.get('domainsForm').setValue(this.displaySelectedDomains);
  }

  PrepareObjectWithDom(val) {
    if (val.domain) {
      this.toggleSelectionDomains(val);
    }
  }

  optionClickedDomain(event, domain) {
    event.stopPropagation();
    this.PrepareObjectWithDom(domain);
  }

  clearFormInputDomains() {
    this.inputFilterForm.controls.domainsForm.setValue('');
  }

  clearInputChecksDomains(checked) {
    for (const check of checked) {
      check.selected = false;
    }

    this.displaySelectedDomains = [];
    this.listFilteredDomains = [];
    this.selectedDomains = [];

    this.inputFilterForm.get('domainsForm').setValue('All domains');
    this.showClearCheckListDomains = false;

    if (this.selectedUsers.length < 1) {
      this.objectReadyToSend.request.filters = [];
      return;
    }
    this.objectReadyToSend.request.filters.length = 1;
  }
}
