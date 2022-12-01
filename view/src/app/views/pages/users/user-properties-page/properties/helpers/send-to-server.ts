import { OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FlashMessagesService } from 'shared/services/flash-messages.service';
import { CrudService } from 'shared/services/cruds/crud.service';
import { UsersEndpointsService } from 'shared/services/cruds/users-endpoints.service';
import { AppLoaderService } from 'shared/services/app-loader/app-loader.service';
import { BuildersForm } from './builders-form';
import { DataTransitionService } from '../../../_services-and-helpers/data-transition.service';
import { User } from "shared/interfaces/users.interface";

export type UserUpdateResponse = {
  success: boolean,
  msg: string,
  userObject: User
}

export class SendToServer extends BuildersForm {
  public showProgressBar = false;

  constructor(
    public fb: FormBuilder,
    public crudService: CrudService,
    public transitServiceHelp: DataTransitionService,
    public flashMessage: FlashMessagesService,
    public http: HttpClient,
    protected usersEndpoints: UsersEndpointsService,
    public loader: AppLoaderService
  ) {
    super(fb, crudService, transitServiceHelp, http);
  }

  sendToServer() {
    this.deleteFakeID();
    const userObject = {
      ...this.user,
      properties: this.properties,
      domains: {
        include: [],
        exclude: [],
        usersDomains: []
      },
    };
    this.showProgressBar = true;
    this.isSaved = true;
    this.displayedExpansionPanel.forEach((e) => {
      e.save = false;
    });
    this.loader.open('Please wait', '840px');
    this.subscriptions.add(
      this.usersEndpoints.updateUser(this.user?._id, { userObject }).subscribe(
        (data: UserUpdateResponse) => {
          this.showProgressBar = false;
          if (data.success) {
            this.flashMessage.flash('success', 'successfully updated', 3000, 'bottom');
          } else {
            this.flashMessage.flash('error', data.msg, 3000, 'bottom');
          }

          this.user = data.userObject;
          this.getDataForTable();
          this.crudService.getVacantById(this.user._id).subscribe((vacant: any) => {
            this.loader.close();
            if (vacant?.success) {
              this.vacantProperties = vacant.result;
            }
          });
        },
        (error: Error) => {
          this.flashMessage.flash('error', error.message || error.toString(), 3000, 'bottom');
          this.showProgressBar = false;
          this.loader.close();
        })
    );
  }

  deleteFakeID() {
    this.properties.usersProperties.forEach((e) => {
      if (e._id === e.property_id + e.property_origin) {
        delete e._id;
      }
    });
    this.properties.include.forEach((e) => {
      if (e._id === e.property_id + e.property_origin) {
        delete e._id;
      }
    });
    this.properties.exclude.forEach((e) => {
      if (e._id === e.property_id + e.property_origin) {
        delete e._id;
      }
    });
  }
}
