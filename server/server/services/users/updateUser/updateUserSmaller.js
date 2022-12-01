const mongoose = require('mongoose');
const User = mongoose.model('User');
const ReportModel = require('../../../database/mongoDB/migrations/reportModel');
const Properties = require('../../../database/mongoDB/migrations/propertyModel');
const bcrypt = require('bcrypt');
const PermissionModel = mongoose.model('Permissions');
const moment = require('moment');

exports.canEditAllUsers = (user, userObject, paramsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      userObject.password = await updatePasswordIfNew(user.password, userObject.password);

      if (userObject.hasOwnProperty('isTest')) {
        const isTest = userObject.isTest;

        delete userObject.isTest;
        userObject.is_test = isTest;
      }

      if (userObject.role === 'PUBLISHER') {
        try {
          // if (userObject.domains.include.length !== 0 || userObject.domains.exclude.length !== 0) {
          //     const dividedDomains = await findAllSubdomains(userObject.domains, user.domains, paramsId);
          //     userObject.domains = dividedDomains.userDomains;
          //     await User.updateProperty(paramsId, userObject.properties, user);
          //     userObject.properties = userObject.properties.usersProperties ? userObject.properties.usersProperties : userObject.properties;
          //     await updateReportsOnDomainChange(paramsId, dividedDomains, userObject.domains);
          // } else {
          if (user.domains && typeof user.domains[0] === 'object') {
            userObject.domains = [];
          }

          await User.updateProperty(paramsId, userObject.properties, user);
          userObject.properties = userObject.properties.usersProperties
            ? userObject.properties.usersProperties
            : userObject.properties;
          // }
          userObject.permissions = await updatePermissionsWbidUser(user.permissions, userObject.wbidType);

          user = await User.findOneAndUpdate({ _id: paramsId }, userObject, { new: true });
        } catch (e) {
          reject(e);
        }
      } else if (['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER'].includes(userObject.role)) {
        try {
          const newUserObject = await sortUserReferences(paramsId, userObject);
          userObject.domains = [];
          user = await User.findOneAndUpdate({ _id: paramsId }, newUserObject, { new: true });
        } catch (e) {
          reject(e);
        }
      } else {
        try {
          userObject.domains = user.domains;
          user = await User.findOneAndUpdate({ _id: paramsId }, userObject, { new: true });
        } catch (e) {
          reject(e);
        }
      }

      resolve(user !== null ? user : null);
    } catch (e) {
      reject(e);
    }
  });
};

exports.canEditAllPubs = async (userObject, paramsId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({
        _id: paramsId,
        role: { $in: ['PUBLISHER', 'ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER'] },
      });
      userObject.password = await updatePasswordIfNew(user.password, userObject.password);
      // userObject.domains = await findAllSubdomains(userObject.domains, user.domains);

      if (!user) {
        reject(false);
      }

      if (userObject.role === 'PUBLISHER') {
        try {
          // if (userObject.domains.include.length !== 0 || userObject.domains.exclude.length !== 0) {
          //     const dividedDomains = await findAllSubdomains(userObject.domains, user.domains, paramsId);
          //     userObject.domains = dividedDomains.userDomains;
          //     await User.updateProperty(paramsId, userObject.properties, user);
          //     userObject.properties = userObject.properties.usersProperties ? userObject.properties.usersProperties : userObject.properties;
          //     await updateReportsOnDomainChange(paramsId, dividedDomains, userObject.domains);
          // } else {
          // userObject.domains = user.domains;
          await User.updateProperty(paramsId, userObject.properties, user);
          userObject.properties = userObject.properties.usersProperties
            ? userObject.properties.usersProperties
            : userObject.properties;
          // }
          userObject.permissions = await updatePermissionsWbidUser(user.permissions, userObject.wbidType);
          userObject.role = user.role;
          user = await User.findOneAndUpdate({ _id: paramsId }, userObject, { new: true });
        } catch (e) {
          reject(e);
        }
      } else if (['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER'].includes(userObject.role)) {
        try {
          const newUserObject = await sortUserReferences(paramsId, userObject);
          user = await User.findOneAndUpdate({ _id: paramsId }, newUserObject, { new: true });
        } catch (e) {
          console.error('rejected');
          reject(e);
        }
      }

      resolve(user !== null ? user : null);
    } catch (e) {
      reject(false);
    }
  });
};

exports.canEditOwnPubs = async (userObject, paramsId, userTokenId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ _id: paramsId, role: { $in: ['PUBLISHER'] }, am: userTokenId });
      userObject.password = await updatePasswordIfNew(user.password, userObject.password);
      // userObject.domains = await findAllSubdomains(userObject.domains, user.domains);
      if (!user) {
        reject(false);
      }

      if (userObject.role === 'PUBLISHER') {
        try {
          // if (userObject.domains.include.length !== 0 || userObject.domains.exclude.length !== 0) {
          //     const dividedDomains = await findAllSubdomains(userObject.domains, user.domains, paramsId);
          //     userObject.domains = dividedDomains.userDomains;
          //     await User.updateProperty(paramsId, userObject.properties, user);
          //     userObject.properties = userObject.properties.usersProperties ? userObject.properties.usersProperties : userObject.properties;
          //     await updateReportsOnDomainChange(paramsId, dividedDomains, userObject.domains);
          // } else {
          // userObject.domains = user.domains;
          await User.updateProperty(paramsId, userObject.properties, user);
          userObject.properties = userObject.properties.usersProperties
            ? userObject.properties.usersProperties
            : userObject.properties;
          // }
          userObject.permissions = await updatePermissionsWbidUser(user.permissions, userObject.wbidType);
          userObject.role = user.role;
          userObject.connected_users = user.connected_users;
          user = await User.findOneAndUpdate({ _id: paramsId }, userObject, { new: true });
        } catch (e) {
          reject(e);
        }
      }

      resolve(user !== null ? user : null);
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

/*
 * 1. Спочатку дивимося на пермішн юзера, який зробив POST реквест. Якщо у нього 'canEditAllUsers', 'canEditAllPubs', приступаємо
 *   перевірки та збереження/видалення референсів.
 * 2. Перевіряємо, які референси у юзера, який апдейтиться, можна змінити. SAM має списки аккаунт менеджерів та паблішерів, AM має список паблішерів.
 * 3. Перевіряємо, які ID з'явилися, а які пропали зі списку референсів.
 * 4. Якщо референсу вже нема, видаляємо його у підлеглого юзера.
 * 5. Якщо референс новий, добавляємо його до юзера.
 * 6. Після успішного оновленням референсів, повідомляємо фронт-енд про це.
 */

async function sortUserReferences(userId, userObj) {
  try {
    const user = await User.findOne({ _id: userId, role: { $in: ['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER'] } });

    if (!user) {
      return {};
    }

    let { p: oldPublishersArr, am: oldAccountManagersArr } = user.connected_users;
    const { p: newPublishersArr, am: newAccountManagersArr } = userObj.connected_users;

    oldPublishersArr = oldPublishersArr.map((pub) => pub.toString());
    oldAccountManagersArr = oldAccountManagersArr.map((am) => am.toString());

    // console.log('oldPubArr', oldPublishersArr, 'newPubArr', newPublishersArr);
    // console.log('oldAccArr', oldAccountManagersArr, 'newAccArr', newAccountManagersArr);

    const acceptedRoles = ['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER'];

    if (acceptedRoles.includes(user.role)) {
      switch (user.role) {
        case 'SENIOR ACCOUNT MANAGER':
          await sortAndUpdate('am', oldPublishersArr, newPublishersArr, userId);
          await sortAndUpdate('sam', oldAccountManagersArr, newAccountManagersArr, userId);
          console.log('this is a SAM');
          return userObj;
        case 'ACCOUNT MANAGER':
          await sortAndUpdate('am', oldPublishersArr, newPublishersArr, userId);
          userObj.connected_users.am = user.connected_users.am || [];
          console.log('this is an AM');
          return userObj;
        default:
          // console.log(user.connected_users);
          userObj.connected_users.am = user.connected_users.am || [];
          userObj.connected_users.p = user.connected_users.p || [];
          return userObj;
      }
    }
  } catch (e) {
    console.error(e);
    throw new Error(e);
  }
}

async function sortAndUpdate(roleToUpdate, oldArr, newArr, userId) {
  for (const userId of newArr) {
    if (typeof userId !== 'string') {
      throw new Error('Elements of a wrong type were received. Only strings are accepted.');
    }
  }
  // console.log(oldArr,'oldArr', newArr, 'newArr');
  const date_to_connect_am = moment().format('YYYY-MM-DD');
  const referencesToRemove = [];
  const referencesToAdd = [];

  for (let ref of oldArr) {
    if (newArr.indexOf(ref) === -1) {
      referencesToRemove.push(ref);
    }
  }

  for (let ref of newArr) {
    if (oldArr.indexOf(ref) === -1) {
      referencesToAdd.push(ref);
    }
  }
  const toRemovePromise = referencesToRemove.map((id) => {
    User.updateOne({ _id: id }, { $set: { [roleToUpdate]: null, date_to_connect_am: null } }).then((res) => {
      ReportModel.updateMany({ 'property.refs_to_user': id }, { 'property.am': null }).then((rep) =>
        console.log(`${rep.nModified} reports were updated`),
      );
    });
  });
  const toAddPromise = referencesToAdd.map((id) => {
    User.updateOne({ _id: id }, { $set: { [roleToUpdate]: userId, date_to_connect_am } }).then((res) => {
      ReportModel.updateMany({ 'property.refs_to_user': id }, { 'property.am': userId }).then((rep) =>
        console.log(`${rep.nModified} reports were updated`),
      );
    });
  });

  await Promise.all([...toAddPromise, ...toRemovePromise]);

  // console.log(referencesToRemove, 'to remove');
  // console.log(referencesToAdd, 'to add');
}
/**
 * @deprecated
 */
async function updateReportsOnDomainChange(userId, newDomains, prevDomains) {
  const { commission, _id, am } = await User.findOne({ _id: userId }, { commission: 1, am: 1 });
  if (newDomains.include.length !== 0) {
    const properties = await Properties.find({ refs_to_user: userId, domain: { $in: newDomains.include } });
    if (!properties.length) {
      return;
    }
    const domainsToAdd = newDomains.include;

    const toAddQueries = domainsToAdd.reduce((acc, domain) => {
      const queriesArray = properties
        .map((property) => {
          return {
            'property.property_id': property.property_id,
            'property.domain': domain,
            // 'property.am': am,
            report_origin: property.property_origin,
          };
        })
        .filter((el) => el !== undefined);
      return [...acc, ...queriesArray];
    }, []);

    if (domainsToAdd.length && toAddQueries.length) {
      const reports = await ReportModel.find({ $or: toAddQueries });
      const updatePromises = reports
        .map((report) => {
          const [propertyObject] = properties.filter(
            (prop) =>
              prop['property_id'] === report.property.property_id &&
              prop['property_origin'] === report.report_origin &&
              prop['domain'] === report.property.domain,
          );

          if (propertyObject && propertyObject.placement_name) {
            report.property.placement_name = propertyObject.placement_name;
          }

          if (report.commission.commission_number === 0) {
            report.commission = commission;
          }
          report.property.refs_to_user = _id;
          report.property.am = am;
          return report.property.placement_name !== null ? report.save() : undefined;
        })
        .filter((item) => item !== undefined);

      await Promise.all(updatePromises);
    }
  }
  if (newDomains.exclude.length !== 0) {
    const properties = await Properties.find({ refs_to_user: { $in: [userId] }, domain: { $in: newDomains.exclude } });
    const domainsToRemove = newDomains.exclude;
    const toRemoveQueries = domainsToRemove.reduce((acc, domain) => {
      const queriesArray = properties
        .map((property) => {
          return {
            'property.property_id': property.property_id,
            'property.domain': domain,
            'property.am': am,
            report_origin: property.property_origin,
          };
        })
        .filter((el) => el !== undefined);
      return [...acc, ...queriesArray];
    }, []);

    if (domainsToRemove.length && toRemoveQueries.length) {
      await ReportModel.updateMany(
        {
          $or: toRemoveQueries,
        },
        {
          'property.refs_to_user': null,
          'property.placement_name': null,
          'property.am': null,
        },
      );
    }
  }
}

async function updatePasswordIfNew(oldPassword, newPassword) {
  try {
    if (!newPassword) return oldPassword;

    return (await isPasswordNew(oldPassword, newPassword)) ? await updatePassword(newPassword) : oldPassword;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

function updatePassword(newPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  });
}

function isPasswordNew(oldPassword, newPassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(newPassword, oldPassword, (err, isMatch) => {
      if (err) reject(err);
      resolve(!isMatch);
    });
  });
}

async function updatePermissionsWbidUser(perms, type) {
  return PermissionModel.setPermissionsForWbid(perms, type);
}
