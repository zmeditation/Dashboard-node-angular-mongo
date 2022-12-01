import { Component, OnInit, OnDestroy } from '@angular/core';
import { PermissionsHTTP } from './http-permissions/http-permissions.servise';
import { egretAnimations } from "shared/animations/egret-animations";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  animations: egretAnimations
})
export class PermissionsComponent implements OnInit, OnDestroy {
  permissionsArray: string[];

  rolesArray: any[];

  publishersArray: any[];

  permissions: any[];

  types: string[] = [];

  roleList: any[];

  arrayOfRolesToSend: string[] = [];

  objectReadyToAdd: any = {};

  arrayOfTypesOfPermissionSet: Set<string> = new Set();

  arrayOfPermissions: string[] = [];

  arrayOfObjectPermissions: any[] = [];

  item = 'permission';

  public roleRows: any[];

  public rows: any[];

  subGetPerm: Subscription;

  subGetPub: Subscription;

  constructor(
    public httpService: PermissionsHTTP
  ) {
  }

  ngOnInit() {
    this.getPermissions();
    this.getPublishers();
  }

  getPermissions() {
    this.subGetPerm = this.httpService.queryGetPermissions().subscribe((data: any) => {
      const { success, permissions } = data;
      if (success) {
        this.permissionsArray = permissions.permissions;
        this.permissions = permissions.descriptions;
        this.roleList = permissions.pre_defined;
        this.rows = this.permissions;
        this.roleRows = this.roleList.map((row) => {
          row.id = row._id;
          return row;
        });
        this.rolesArray = this.roleList.map((obj) => obj.name);
      }
    });
  }

  getPublishers() {
    const query = {
      findBy: ['ALL'],
      options: '_id name permissions role'
    };

    this.subGetPub = this.httpService.queryGetPublishers(query).subscribe((data: any) => {
      const { success, publishers } = data;

      if (success === true) {
        this.publishersArray = [...publishers];
      }


    });
  }

  manageArrays() {
    this.arrayOfPermissions = [];
    this.arrayOfObjectPermissions = [];
    this.permissions.forEach((data: any) => {
      this.arrayOfTypesOfPermissionSet.add(data.type);
    });

    this.arrayOfTypesOfPermissionSet.forEach((data) => {
      this.arrayOfPermissions.push(data);
    });

    for (let i = 0; i < this.arrayOfPermissions.length; i++) {
      this.arrayOfObjectPermissions.push({
        type: this.arrayOfPermissions[i],
        res: this.permissions.filter((obj: any) => {
          return obj.type === this.arrayOfPermissions[i];
        })
      });
    }

    this.types = this.arrayOfPermissions;
  }

  selectItem(itemName): void {
    this.item = itemName;
  }

  ngOnDestroy(): void {
    if (this.subGetPerm !== undefined) {
      this.subGetPerm.unsubscribe();
    }

    if (this.subGetPub !== undefined) {
      this.subGetPub.unsubscribe();
    }
  }
}
