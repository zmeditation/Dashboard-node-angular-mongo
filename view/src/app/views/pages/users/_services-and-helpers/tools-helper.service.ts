import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolsHelperService {
  public tools_list: any[] = [
    {
      label: 'TOOLS.CONTACTS_TITLE',
      template: `app-contacts`
    },
    {
      label: 'TEST',
      template: 'nothing'
    }
  ];

  constructor() {}
}
