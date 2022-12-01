import ServiceRunner from '../../services/ServiceRunner';
import { Request, Response } from '../../interfaces/express';
const passport = require('passport');

const AddPermission = require('../../services/permissions/AddPermission');
const AddPermissions = require('../../services/permissions/AddPermissions');
const GetPermissions = require('../../services/permissions/GetPermissions');
const RemovePermission = require('../../services/permissions/RemovePermission');
const RemoveRole = require('../../services/permissions/RemoveRole');
const AddRole = require('../../services/permissions/AddRole');
const EditPermissions = require('../../services/permissions/EditPermissions/EditPermissions');

function permissionCheck(permissionsArray: string[]) {
  return (req: Request, res: Response, next: Function) => {
    passport.authenticate('jwt', function (err: Error, user: any) {
      if (user) {
        const [permElem, canAccess] = comparePermissions(user.permissions, permissionsArray);
        canAccess ? continueIfTrue(permElem) : res.status(403).send({ msg: 'FORBIDDEN' });

        function comparePermissions(userPermissions: any, compPermissions: any) {
          let perm = '';
          let canAccess = userPermissions.some((element: any) => {
            perm = element;
            return compPermissions.includes(element);
          });

          return [perm, compPermissions.length === 0 || canAccess];
        }

        function continueIfTrue(perm: any) {
          req.body['additional'] = {
            id: user._id,
            wbidUserId: user.wbidUserId,
            permission: perm,
            permissions: user.permissions,
            photo: user.photo,
            name: user.name,
            role: user.role,
            oRTBId: user.oRTBId,
            oRTBType: user.oRTBType
          };
          next();
        }
      } else {
        return res.status(401).send({ msg: 'UNAUTHORIZED' });
      }
    })(req, res, next);
  };
}

const controllerServices = {
  addPermission: ServiceRunner(AddPermission, (req: any) => {
    return { body: req.body };
  }),
  addPermissions: ServiceRunner(AddPermissions, (req: any) => {
    return { body: req.body };
  }),
  getPermissions: ServiceRunner(GetPermissions, (req: any) => {
    return { body: req.body, query: req.query };
  }),
  removePermission: ServiceRunner(RemovePermission, (req: any) => {
    return { body: req.body };
  }),
  addRole: ServiceRunner(AddRole, (req: any) => {
    return { body: req.body };
  }),
  removeRole: ServiceRunner(RemoveRole, (req: any) => {
    return { body: req.body, roleId: req.params.id };
  }),
  editPermissions: ServiceRunner(EditPermissions, (req: any) => {
    return { body: req.body };
  }),
  permissionCheck
};
export default controllerServices;
