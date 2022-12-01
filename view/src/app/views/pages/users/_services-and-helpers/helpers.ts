import { DataTransitionService } from './data-transition.service';
import { FormValidators } from 'shared/services/form-validators/form-validators';

export class Helpers extends FormValidators {
  public objectTransferData: any = {};

  public isEdited = 0;

  public invalid = true;

  public saveButtonDisabled = true;

  constructor(public transitServiceHelp: DataTransitionService) {
    super();
  }

  sendFunc(prop, variables) {
    this.objectTransferData[prop] = variables;
    this.transitServiceHelp.sendMessage(this.objectTransferData);
  }

  sendEditable(bool: boolean) {
    if (bool && this.isEdited === 0) {
      this.objectTransferData.waschanged = true;
      this.isEdited = 1;
    }
    if (this.isEdited === 0) { this.objectTransferData.waschanged = false; }

    this.objectTransferData.editable = bool;
    this.transitServiceHelp.sendMessage(this.objectTransferData);
  }
}
