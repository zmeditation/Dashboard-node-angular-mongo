const mongoose = require('mongoose');
const User = mongoose.model('User');
const isValid = mongoose.Types.ObjectId.isValid;

const findAvailablePublisherDeductions = async (usersId, typeOfDeepQuery) => {
  try {
    const usersArray = await User.find({ _id: { $in: usersId } }).exec();

    if (!usersArray) {
      throw { error: { msg: 'Invalid user _id' } };
    }

    const availablePubPromises = [];
    
    for await (let user of usersArray) {
      const pubs = actionByUsersRole(user, typeOfDeepQuery);
      availablePubPromises.push(pubs);
    }

    const promiseRes = await Promise.all(availablePubPromises);
    const availablePubs = recursiveFlat(promiseRes).map(id => {
      if (id) {
        return id.toString();
      }
    });

    if (Array.isArray(availablePubs) && availablePubs.length <= 0) {
      return { errorAvailablePubs: { msg: 'You haven`t publishers' } };
    }

    return {
      availablePubs,
      errorAvailablePubs: null
    }

  } catch (error) {
    console.log(error);
    return {
      availablePubs: null,
      errorAvailablePubs: { msg: `Deduction error, ${error.error.msg || error.path}` }
    };
  }

};

const actionByUsersRole = async (user, typeOfDeepQuery) => {

  try {
    const pubIdsArray = [];

    if (!user) {
      return pubIdsArray;
    }

    const response = await findConnectedPub(user.connected_users, typeOfDeepQuery);

    if (response !== null) {
      pubIdsArray.push(...response);
    }

    return pubIdsArray;

  } catch (error) {

    console.log(error);
    return [];
  }
};

const findConnectedPub = async (connected_users, typeOfDeepQuery) => {
  try {
    const pubIdsArray = connected_users['p'];
    const amIdsArray = connected_users['am'];
    const publishersArray = [];

    if (pubIdsArray.length === 0 && amIdsArray.length === 0) {
      return null;
    }

    if (pubIdsArray.length > 0) {
      pubIdsArray.forEach(id => isValid(id) === true && publishersArray.push(id));
    }

    if (amIdsArray.length > 0 && typeOfDeepQuery === 'allPubs') {
      const { availablePubs, errorAvailablePubs } = await findAvailablePublisherDeductions(amIdsArray, typeOfDeepQuery);
      if (errorAvailablePubs === null) {
        publishersArray.push(...availablePubs);
      }
    }

    return publishersArray;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const recursiveFlat = (array) => {
  const newArray = [];

  array.forEach(el => {
    if (Array.isArray(el) === true) {
      const arr = recursiveFlat(el);
      newArray.push(...arr);
    } else if (isValid(el)) {
      newArray.push(el);
    }
  });
  return newArray;
};

module.exports = {
  findAvailablePublisherDeductions: findAvailablePublisherDeductions
}