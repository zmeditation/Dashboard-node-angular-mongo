import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt';
import User from '../../../database/mongoDB/migrations/UserModel';
import PermissionModel from '../../../database/mongoDB/migrations/permissionModel';
import Base from './../../Base';
import { ServerError } from '../../../handlers/errorHandlers';
import { createDeductionSchema } from '../../deduction/deductionsHelper/helper';

// POST: api/users
// adds a user to the DB.

export default class AddUser extends Base {
  constructor(args: any) {
    super(args);
  }

  async execute({
    body: {
      additional: { permission },
      userObject,
    },
  }: any) {
    await this._checkEmailExist(userObject.email);

    userObject.uuid = uuidV4(userObject);

    try {
      userObject.password = await this._encryptPassword(userObject.password);
      userObject.permissions = await this._setNewUserPermissions(userObject.role, userObject.wbidType);

      if (userObject.hasOwnProperty('isTest')) {
        const isTest = userObject.isTest;

        delete userObject.isTest;
        userObject.is_test = isTest;
      }

      const newUser = await this._createUser(userObject);

      return {
        success: true,
        msg: 'USER_SUCCESSFULLY_ADDED',
        userObject: {
          _id: newUser._id,
          wbidUserId: newUser.wbidUserId,
          wbidType: newUser.wbidType,
        },
      };
    } catch (e) {
      console.error(e);
      throw new ServerError('ERROR_WHILE_ADDING_USER', 'CONFLICT');
    }
  }

  async _checkEmailExist(email: string): Promise<void | never> {
    const isExist = await User.findOne({ email });

    if (isExist) {
      throw new ServerError('ERROR_USER_ALREADY_EXIST', 'CONFLICT');
    }
  }

  _setNewUserPermissions(role: string, wbidType: any): Promise<any> {
    return PermissionModel.setPermissions(role, wbidType);
  }

  _encryptPassword(password: string): Promise<string | never> {
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          reject(err);
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          }

          resolve(hash);
        });
      });
    });
  }

  async _createUser(data: any): Promise<any> {
    const user: any = new User(data);

    if ('PUBLISHER' === user.role) {
      await createDeductionSchema(user._id);
    }

    return user.save();
  }
}
