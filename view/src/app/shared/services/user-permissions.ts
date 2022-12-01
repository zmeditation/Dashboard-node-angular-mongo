import { Injectable } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({providedIn: 'root'})
export class UserPermissions {
  public byReportsPerm = false;

  public byUsersPerm = false;

  public isPartner = false;

  constructor(public NgxPermissionsS: NgxPermissionsService) {}

  permissionsByReports() {
    const userPermissions = this.NgxPermissionsS.getPermissions();

    // tslint:disable-next-line:forin
    for (const perm in userPermissions) {
      if (perm === 'canReadAllReports') {
        this.byReportsPerm = true;
        break;
      }
      if (perm === 'canReadAllPubsReports') {
        this.byReportsPerm = true;
        break;
      }
      if (perm === 'canReadOwnPubsReports') {
        this.byReportsPerm = true;
        break;
      }
      if (perm === 'canReadOwnReports') {
        this.byReportsPerm = false;
        break;
      }
    }
  }

  permissionsByUsers() {
    const userPermissions = this.NgxPermissionsS.getPermissions();

    // tslint:disable-next-line:forin
    for (const perm in userPermissions) {
      if (perm === 'canReadAllUsers') {
        this.byUsersPerm = true;
        break;
      }
      if (perm === 'canReadAllPubsReports') {
        this.byUsersPerm = true;
        break;
      }
      if (perm === 'canReadOwnPubsReports') {
        this.byUsersPerm = true;
        break;
      }
      if (perm === 'canReadOwnPubs') {
        this.byUsersPerm = false;
        break;
      }
    }
  }

  checkIfPartner() {
    const permsArray = Object.keys(this.NgxPermissionsS.getPermissions());
    if (permsArray.includes('canSeeDSPoRTBReports') || permsArray.includes('canSeeSSPoRTBReports')) {
      this.isPartner = true;
    }
  }
}
