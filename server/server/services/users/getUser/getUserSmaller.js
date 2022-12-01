const mongoose = require('mongoose');
const User = mongoose.model('User');
const Domains = mongoose.model('Domains');
const allowedUserFields = require('../../../constants/allowedUserFields');

exports.getUserIfSameId = async ({ paramsId, fields }) => {
  let user = await User.findById(paramsId, {
    additional: true,
    email: true,
    name: true,
    photo: true,
    domains: true,
    role: true
  });

  if (fields.length) {
    user = structureUserByFieldsParameter(user, fields);
  }

  return { user };
};

exports.canReadAllUsers = ({ paramsId, fields }) => {
  return new Promise(async (resolve) => {
    let user = await User.findOne({ _id: paramsId }, allowedUserFields)
      .populate({ path: 'connected_users.am', select: 'name _id' })
      .populate({ path: 'connected_users.p', select: 'name _id date_to_connect_am' })
      .populate({ path: 'sam', select: 'name _id' })
      .populate({ path: 'am', select: 'name _id' });
    user?.domains = await Domains.find({ refs_to_user: { $in: paramsId }, approved: true }, { domain: true, _id: false })
      .lean()
      .then((res) => {
        return res.map((el) => el.domain);
      });

    if (fields.length) {
      user = structureUserByFieldsParameter(user, fields);
    }

    resolve({ user });
  });
};

exports.canReadAllPubs = ({ paramsId, fields }) => {
  return new Promise(async (resolve) => {
    let user = await User.findOne(
      { _id: paramsId, role: { $in: ['PUBLISHER', 'ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER', 'MEDIA BUYER', 'FINANCE MANAGER'] } },
      allowedUserFields
    )
      .populate({ path: 'connected_users.am', select: 'name _id' })
      .populate({ path: 'connected_users.p', select: 'name _id date_to_connect_am' })
      .populate({ path: 'sam', select: 'name _id' })
      .populate({ path: 'am', select: 'name _id' });
    user?.domains = await Domains.find(
      { refs_to_user: { $in: paramsId }, approved: true },
      { domain: true, _id: false }
    )
      .lean()
      .then((res) => {
        return res.map((el) => el.domain);
      });

    if (fields.length) {
      user = structureUserByFieldsParameter(user, fields);
    }

    resolve({ user });
  });
};

exports.canReadOwnPubs = ({ paramsId, userTokenId, fields }) => {
  return new Promise(async (resolve) => {
    let user = await User.findOne(
      {
        _id: paramsId,
        role: 'PUBLISHER',
        am: userTokenId
      },
      allowedUserFields
    )
      .populate({ path: 'sam', select: 'name _id' })
      .populate({ path: 'am', select: 'name _id' });
    user?.domains = await Domains.find({ refs_to_user: { $in: paramsId }, approved: true }, { domain: true, _id: false })
      .lean()
      .then((res) => {
        return res.map((el) => el.domain);
      });

    if (fields.length) {
      user = structureUserByFieldsParameter(user, fields);
    }

    resolve({ user });
  });
};

function structureUserByFieldsParameter(user, fields) {
  const result = {};

  for (const field of fields) {
    result[field] = user[field];
  }

  return result;
}
