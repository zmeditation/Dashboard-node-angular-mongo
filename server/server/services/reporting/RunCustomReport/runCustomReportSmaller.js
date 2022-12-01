const mongoose = require('mongoose');
const Domains = mongoose.model('Domains');
const User = mongoose.model('User');
const { runAggregationQuery } = require('../../../modules/reporting/queryModule/queryRunner/index');
const { changeQueryObjectByPermission } = require('./changeQueryObjectByPermission/index');
const { REPORT_FILTERS } = require('../../../constants/reportFilters');

exports.canReadAllReports = async (queryObject, userTokenId) => {
  const pubsQuery = statusOfPublishers(queryObject) 
    ? { role: 'PUBLISHER', 'enabled.status': true } 
    : { role: 'PUBLISHER' };

  try {
    const users = await getUsers(queryObject, pubsQuery);
    const gfc = queryObject.gfc ? queryObject.gfc : false,
      queryOptions = generateQueryOptions(queryObject, userTokenId, 'canReadAllReports'),
      usersByCommissionType = sortAllowedByCommissionType(users);
    const filteredQueryObject = changeQueryObjectByPermission(queryOptions, usersByCommissionType);

    return runAggregationQuery(filteredQueryObject, gfc, userTokenId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

exports.canReadAllPubsReports = async (queryObject, userTokenId) => {
  const { idsArray, user } = await findCurrentUser(userTokenId);
  const allPubsID = await findPubsOfAM(idsArray);
  const onlyActive = statusOfPublishers(queryObject);
  const queryToFind = filterByRole(user, allPubsID, onlyActive);

  try {
    const users = await getUsers(queryObject, queryToFind);
    const gfc = false,
      queryOptions = generateQueryOptions(queryObject, userTokenId, 'canReadAllPubsReports'),
      usersByCommissionType = sortAllowedByCommissionType(users);

    const filteredQueryObject = changeQueryObjectByPermission(queryOptions, usersByCommissionType);

    return runAggregationQuery(filteredQueryObject, gfc, userTokenId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

exports.canReadOwnPubsReports = async (queryObject, userTokenId) => {
  const query = { am: userTokenId };
  const enabledPubsFilter = queryObject?.filters?.filter?.((el) => el?.filterId === REPORT_FILTERS.PUBLISHERS)?.length;

  if (!enabledPubsFilter) {
    query['enabled.status'] = { $ne: false };
  }

  try {
    const users = await getUsers(queryObject, query);
    const gfc = false,
      queryOptions = generateQueryOptions(queryObject, userTokenId, 'canReadOwnPubsReports'),
      usersByCommissionType = sortAllowedByCommissionType(users);

    const filteredQueryObjects = changeQueryObjectByPermission(queryOptions, usersByCommissionType);

    return runAggregationQuery(filteredQueryObjects, gfc, userTokenId);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

exports.canReadOwnReports = async (queryObject, userTokenId) => {
  const usersDomains = await Domains.find({ enabled: true, refs_to_user: { $in: [userTokenId] } })
    .lean()
    .distinct('domain');
  return new Promise((resolve, reject) => {
    try {
      User.find({ _id: userTokenId })
        .select('name commission _id domains properties am')
        .then((user) => {
          user[0].domains = usersDomains;
          const gfc = false,
            queryOptions = generateQueryOptions(queryObject, userTokenId, 'canReadOwnReports'),
            usersByCommissionType = sortAllowedByCommissionType(user);

          const filteredQueryObjects = changeQueryObjectByPermission(queryOptions, usersByCommissionType);

          const result = runAggregationQuery(filteredQueryObjects, gfc, userTokenId);

          resolve(result);
        });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

function statusOfPublishers(query) {
  const filtersArray = query.filters.map((el) => {
    return el.name;
  });
  return !filtersArray.includes('PUBLISHERS');
}

async function findPubsOfAM(arr) {
  const allPubsID = [];
  for (const id of arr) {
    const currentUser = await User.findOne({ _id: id });
    if (currentUser && currentUser.role === 'ACCOUNT MANAGER') {
      currentUser.connected_users.p.forEach((el) => {
        allPubsID.push(el);
      });
    } else if (currentUser && currentUser.role === 'PUBLISHER') {
      allPubsID.push(currentUser._id);
    }
  }
  return allPubsID;
}

async function findCurrentUser(userTokenId) {
  const user = await User.findOne({ _id: userTokenId }).sort({ name: 1 });
  const idsArray = [];
  idsArray.push(user._id);
  user.connected_users.am.forEach((el) => {
    idsArray.push(el);
  });
  user.connected_users.p.forEach((el) => {
    idsArray.push(el);
  });
  return {
    idsArray,
    user: user
  };
}

function filterByRole(user, idsAllPubs, onlyActive) {
  let queryToFind = undefined;
  if (user.role === 'CEO MANAGE' || user.role === 'CEO') {
    queryToFind = onlyActive
      ? {
          role: 'PUBLISHER',
          'enabled.status': true
        }
      : {
          role: 'PUBLISHER'
        };
  } else {
    if (user.role !== 'AD OPS' && user.role !== 'MEDIA BUYER' && user.role !== 'SENIOR ACCOUNT MANAGER') {
      queryToFind = onlyActive
        ? {
            role: 'PUBLISHER',
            _id: { $in: idsAllPubs },
            'enabled.status': true
          }
        : {
            role: 'PUBLISHER',
            _id: { $in: idsAllPubs }
          };
    } else {
      queryToFind = onlyActive
        ? {
            role: 'PUBLISHER',
            'enabled.status': true
          }
        : {
            role: 'PUBLISHER'
          };
    }
  }
  return queryToFind;
}

// Stays in the file for now

function generateQueryOptions(query, userId, permission) {
  return {
    queryObject: query,
    userTokenId: userId,
    permission: permission
  };
}

function sortAllowedByCommissionType(users) {
  const allowedCommissionTypes = ['eCPM', 'Impressions'];
  const filteredOutUsers = users.filter((user) => allowedCommissionTypes.includes(user.commission.commission_type));

  return filteredOutUsers.reduce((acc, user) => {
    acc[user.commission.commission_type] = acc[user.commission.commission_type]
      ? acc[user.commission.commission_type]
      : { domains: [], publishers: [], properties: [], placements: [], publishersWithName: [], managers: [], managersWithName: [] };
    acc[user.commission.commission_type] = {
      domains: [...acc[user.commission.commission_type]['domains'], ...user.domains],
      properties: [...acc[user.commission.commission_type]['properties'], ...user.properties.map((prop) => prop.property_id)],
      placements: [...acc[user.commission.commission_type]['placements'], ...user.properties.map((prop) => prop.placement_name)],
      publishers: [...acc[user.commission.commission_type]['publishers'], user._id.toString()],
      publishersWithName: [...acc[user.commission.commission_type]['publishersWithName'], { _id: user._id, name: user.name }],
      managers: [...acc[user.commission.commission_type]['managers'], user.am ? user.am._id.toString() : null],
      managersWithName: [...acc[user.commission.commission_type]['managersWithName'], user.am]
    };
    return acc;
  }, {});
}

async function getUsers({ filters }, userQuery) {
  const publisherFilter = filters.find(f => f.filterId === REPORT_FILTERS.PUBLISHERS);

  const domains = await Domains
    .find({
      enabled: true,
      ...publisherFilter && {
        refs_to_user: {
          $in: publisherFilter.values 
        }
      }
    })
    .select('domain refs_to_user -_id')
    .lean();

  const usersDomains = domains.reduce((acc, { refs_to_user, domain }) => {
    refs_to_user.forEach((user) => {
      const userId = user.toString();

      acc.set(userId, {
        user: userId,
        domains: [ ...acc.get(userId)?.domains ?? [], domain ]
      });
    });

    return acc;
  }, new Map());

  const users = await User
    .find({
      ...userQuery,
      ...publisherFilter && {
        _id: {
          $in: publisherFilter.values 
        }
      }
    })
    .select('_id name commission domains properties am')
    .populate({
      path: 'am',
      select: 'name _id'
    })
    .lean();

    return users.map(user => {
      const userId = user._id.toString();
      const domains = usersDomains.get(userId)?.domains ?? [];
      return { ...user, domains };
    });
}