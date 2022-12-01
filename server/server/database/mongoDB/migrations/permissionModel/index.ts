const mongoose = require('mongoose');
import { Schema, model, Model, Document } from 'mongoose';

const permissionId = process.env.PERMISSION_ID;

interface Description {
  name: string,
  description: string,
  type: string
}

interface PreDefined {
  name: string,
  permissions: string[]
}

interface Permission extends Document {
  permissions: string[],
  descriptions: Description[],
  pre_defined: PreDefined[],
}

interface PermModel extends Model<Permission> {
  setPermissions(role: any, wbidType: any): Promise<any>,

  getRoles(permission: string): Promise<any>,

  setPermissionsForWbid(perm: any, type: any): Promise<any>
}

mongoose.Promise = global.Promise;

const permissionsSchema = new Schema<Permission, PermModel>({
  permissions: [{
    type: String,
    required: true
  }],
  descriptions: [{
    name: { type: String },
    description: { type: String },
    type: { type: String }
  }],
  pre_defined: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    permissions: [{
      type: String,
      required: true
    }]
  }]
});

permissionsSchema.static('setPermissions', async function (role, wbidType) {
  const permission = await this.findOne({ _id: permissionId });
  return new Promise((resolve, reject) => {
    try {
      if (permission) {
        for (const permissions of permission["pre_defined"]) {
          if (permissions.name === role) {
            const permList = role === 'PUBLISHER'
              ? this.setPermissionsForWbid(permissions.permissions, wbidType)
              : permissions.permissions;
            resolve(permList);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  })
});

permissionsSchema.static('getRoles', async function (permission: string) {
  return new Promise(async resolve => {
    if (permission) {
      switch (permission) {
        case 'canReadAllUsers':
          this.findOne().then((permissionColl: any) => {
            resolve(permissionColl.pre_defined.map((role: { name: any; }) => role.name));
          });
          break;
        case 'canReadAllPubs':
          resolve(['ACCOUNT MANAGER', 'PUBLISHER', 'SENIOR ACCOUNT MANAGER']);
          break;
        case 'canReadOwnPubs':
          resolve(['PUBLISHER']);
          break;
        default:
          resolve([]);
      }
    }
  })
});

permissionsSchema.static('setPermissionsForWbid', async function (perm, type) {
  let postbidPermissions = [
      'canSeeWBidPage',
      'canSeeWBidChartsPage'
    ],
    prebidPermissions = [
      'canSeeWBidPage',
      'canSeeWBidChartsPage',
      'canSeeWBidTablesPage',
      'canSeeWBidIntegrationPage',
      'canCreateWBidPlacements',
      'canEditWBidPlacements',
      'canDeleteWBidPlacements',
      'canDeleteWBidSites',
      'canEditWBidSites',
      'canSeeWBidActions',
      'canSeeWBidMarketplace',
      'canSeeWBidStatusAdsTxt',
      'canReadOwnWBidReports',
      'canEditOwnPermissions',
      'canSeeOwnWBidSettings'
    ],
    fullWbidPermissions = [
      'canSeeWBidPage',
      'canSeeWBidChartsPage',
      'canSeeWBidTablesPage',
      'canSeeWBidIntegrationPage',
      'canCreateWBidPlacements',
      'canEditWBidPlacements',
      'canDeleteWBidPlacements',
      'canDeleteWBidSites',
      'canEditWBidSites',
      'canSeeWBidActions',
      'canSeeWBidMarketplace',
      'canSeeWBidStatusAdsTxt',
      'canReadOwnWBidReports',
      'canEditOwnPermissions',
      'canSeeOwnWBidSettings'
    ],
    permsForDeletion = [
      'canSeeDashboardPage',
      'canSeeReportsPage',
      'canReadOwnReports',
      'canDownloadReports',
      'canReadOwnDomains',
      'canSeeSettingsPage',
      'hideRequestsAndFillrate',
      'canUseAPIAccessForReports'
    ];
  fullWbidPermissions.forEach(el => {
    perm.forEach((item: string) => {
      if (item === el) {
        perm.splice(perm.indexOf(item), 1);
      }
    })
  });
  if (type.length > 0) {
    let result = perm;
    switch (type.length) {
      case 1:
        type[0] === 'postbid' ? postbidPermissions.forEach(el => {
            permsForDeletion.forEach(item => {
              if (!perm.includes(item) && item !== 'hideRequestsAndFillrate') {
                perm.push(item);
              }
            });
            if (!result.includes(el)) {
              result.push(el);
            }
          })
          : prebidPermissions.forEach(el => {
            permsForDeletion.forEach(block => {
              perm.forEach((item: string) => {
                if (item === block) {
                  perm.splice(perm.indexOf(item), 1);
                }
              })
            });
            if (!result.includes(el)) {
              result.push(el);
            }
          });
        return result;
      case 2:
        fullWbidPermissions.forEach(el => {
          permsForDeletion.forEach(item => {
            if (!perm.includes(item)) {
              perm.push(item);
            }
          });
          if (!result.includes(el)) {
            result.push(el);
          }
        });
        return result;
    }
  } else {
    permsForDeletion.forEach(el => {
      if (!perm.includes(el) && el !== 'hideRequestsAndFillrate') {
        perm.push(el);
      }
    });
    return perm;
  }
});

export const PermissionModel: PermModel = model<Permission, PermModel>('Permissions', permissionsSchema);
export default PermissionModel;
