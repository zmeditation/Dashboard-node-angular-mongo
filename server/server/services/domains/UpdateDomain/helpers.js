const mongoose = require("mongoose");
const Domains =  mongoose.model("Domains");
const ReportModel = require('../../../database/mongoDB/migrations/reportModel');
const Properties = mongoose.model("Property");
const Users = mongoose.model('User');
const moment = require('moment');
const { addDomain } = require('../AddDomain/helpers');

const canReadAllUsers = async (params, userId) => {
  const { user: pubId, include, exclude } = params;
  const publishersDomains = await Domains.find({ refs_to_user: { $in: pubId } }).then(res => {
    return res.map(el => el.domain);
  });
  /* Find all subdomains from Reports collection for creating and connecting to publisher
    comment this call for first intagration on prod;
    do not use variable "moreInclude", instead - "include"
  */
  const moreInclude = await findAllSubdomains(include, publishersDomains);

  /* Updating domains object by disabling if no connections with publishers */
  const includeResult = await getIncludeResult(moreInclude, pubId, userId);
  console.log(`include result for user ${pubId}`, includeResult);
  await propertiesUpdate(moreInclude, pubId);

  /* Updating domains object by enabling and connect to publisher;
    create, if domain is absent */
  const excludeResult = await getExcludeResult(exclude, pubId, userId);
   console.log('exclude result', excludeResult)
  await propertiesUpdate(exclude, pubId, 'exclude');

  const result = {
    include: {
      errors: {
        status: includeResult.name !== 'Error' ? 0 : 1,
        message: includeResult.name === 'Error' ? includeResult.message : ''
      },
      result: includeResult
    },
    exclude: {
      errors: {
        status: excludeResult.name !== 'Error' ? 0 : 1,
        message: excludeResult.name === 'Error' ? excludeResult.message : ''
      },
      result: excludeResult
    }
  }
  return result;
};

async function getIncludeResult(list, pubId, userId) {
  if (!list.length) return 'No domains for include';
  const promisesArray = [];

  return await Domains.find({ domain: { $in: list } }).then(res => {

    try {
      if (!res.length) {
        list.forEach(el => {
          promisesArray.push(addDomain(el, userId, pubId));
        });
        return Promise.all(promisesArray).then(r => {
          const filtered = r.filter(d => d);
          return `${filtered.length} domains created successful`;
        });
      } else if (res.length !== list.length) {
        res.forEach((el) => {
          const existingDomain = el.domain,
                indExiDomain = list.indexOf(existingDomain);
          if (list.includes(existingDomain)) {

            list.splice(indExiDomain, 1);
          }
        });
        list.forEach(el => {
          promisesArray.push(addDomain(el, userId, pubId));
        });
      }
      res.forEach(el => {
        if (el.refs_to_user.includes(pubId)) {
          promisesArray.push(`This user already use domain - ${el.domain}`);
        } else {
          el.refs_to_user.push(pubId);
          el.enabled = true;
          el.last_modify = {
            user: userId,
            date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            changes: `Connected domain to publisher`
          }
          promisesArray.push(el.save({ validateBeforeSave: false }));
          if (el.$op !== 'save') {
            throw new Error(`Couldn't update object of domain - ${el.domain}`);
          }
        }
      })
      return Promise.all(promisesArray).then(r => {
        return `${r.length} connected to this user successful`;
      });
    } catch(err) {
      return err;
    }
  });
}

async function getExcludeResult(list, pubId, userId) {
  if (!list.length) return 'No domains for exclude';
  const promisesArray = [];
  return await Domains.find({ domain: { $in: list } }).then(res => {

    try {
      if (!res.length) {
        promisesArray.push('No domains in database');
        return promisesArray;
      }
      res.forEach(el => {
        if (!el.refs_to_user.includes(pubId)) {
          promisesArray.push(`This user do not use this domain - ${el.domain}`);
        }
        const newUsersArray = el.refs_to_user.filter(u => u.toString() !== pubId)
        el.refs_to_user = newUsersArray;
        el.enabled = !!el.refs_to_user.length;
        el.last_modify = {
          user: userId,
          date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
          changes: `Disconnected domain from publisher`
        }
        promisesArray.push(el.save({ validateBeforeSave: false }));
        if (el.$op !== 'save') {
          throw new Error(`Couldn't update object of domain - ${el.domain}`);
        }

      })
      return Promise.all(promisesArray).then(r => {
        return `${r.length} disconnected from this user successful`;
      });
    } catch(err) {
      return err;
    }
  });
}

async function findAllSubdomains(domains, usedDomains) {
  const regExpStringsInc = regexConfigForSubdomains(domains);
  const period = getPeriod();
  const regexReadyFormsInc = regExpStringsInc.map(el => new RegExp(...el));
  const domainsForInclude = await ReportModel.find({
    $and: [
      {
        'property.domain': { $in: regexReadyFormsInc }
      },
      {
        'property.domain': { $nin: usedDomains }
      }
    ],
    'property.refs_to_user': null,
    'day': period
  }).distinct("property.domain").then(reps => {
        domains.forEach(el => {
          if (!reps.includes(el)) {
            reps.push(el);
          }
        });
        return reps;
    });
  return Array.from(new Set(domainsForInclude));
}

function regexConfigForSubdomains(domains) {
  return domains.map(el => {
    if (el.match(/\./g).length === 1) {
      const regexForm = [`(.*\\.|^)${el}$`];
      return regexForm;
    }
      return [el];
  }).filter(el => el !== null && el !== undefined);
};

function getPeriod() {
  return {
    $gte:  moment(new Date()).subtract(8, 'months').format('YYYY-MM-DD'),
  }
}

async function propertiesUpdate(list, pubId, type = 'include') {
  if (!list.length) return;
  let counter = 0;
  if (type === 'include') {
    const adUnitsConnected = await Properties.find({
      refs_to_user: pubId
      // domain: { $in: list }
    }, {
      property_id: true,
      property_origin: true,
      placement_name: true,
      _id: false
    }).lean().then(result => {

      if (!result.length) return [];

      const listOfPlacaments = [];
      const outputResult = result.reduce((acc, el, index) => {
        if (!acc.length) {
          acc.property_id = [acc.property_id];
          acc.property_origin = [acc.property_origin];
          acc = [acc];
        }
        if (!listOfPlacaments.includes(el.placement_name)) {
          listOfPlacaments.push(el.placement_name);
          const newPlacementObj = {
            placement_name: el.placement_name,
            property_origin: [el.property_origin],
            property_id: [el.property_id]
          }
          acc.push(newPlacementObj);
        } else {
          const accIndex = listOfPlacaments.indexOf(el.placement_name);
          if (!acc[accIndex].property_id.includes(el.property_id)) {
            acc[accIndex].property_id.push(el.property_id);
          }
          if (!acc[accIndex].property_origin.includes(el.property_origin)) {
            acc[accIndex].property_origin.push(el.property_origin);
          }
        }
        return acc;
      });
      return outputResult.length ? outputResult : [outputResult];
    });

    const user = await Users.findById(pubId, 'am name commission').lean();
    const propsPromises = adUnitsConnected.map(el => {
      return Properties.updateMany({
        domain: { $in: list },
        property_id: { $in: el.property_id },
        property_origin: { $in: el.property_origin },
        $or: [
          { refs_to_user: { $exists: false } },
          { refs_to_user: null }
        ]
      }, {
        refs_to_user: pubId
      });
    });
    Promise.all(propsPromises).then(rep => {
      console.log('Properties updated successfully');
    });
    await reportsUpdateInside(adUnitsConnected, counter, 5, list, user);
  }

  if (type === 'exclude') {
    await ReportModel.updateMany({
      'property.domain': { $in: list },
      'property.refs_to_user': pubId
    }, {
      'property.refs_to_user': null,
      'property.am': null,
    }).then(res => {
      console.log(`${res.nModified} reports were disconnected from user`)
    })
  }
}

function reportsUpdateInside(arr, index, limit, list, user) {
  console.log(index === 0 ? 'Reports updating started...' : 'Reports updating continue...');
  console.log('Current count is', index, 'of total', arr.length);
  const lengthOfArray = index + limit;
  const arrayForWork = arr.slice(index, lengthOfArray);
  const promisesArray = arrayForWork.map(el => {
      return reportsUpdate(list, el, user);
  });
  
  Promise.all(promisesArray).then(rep => {
    console.log('Reports keep updating successfully');
    index += limit;
    if (index < arr.length) {
      setTimeout(() => reportsUpdateInside(arr, index, limit, list, user), 3000);
    } else {
      clearTimeout(setTimeout(() => reportsUpdateInside(arr, index, limit, list, user), 3000));
      console.log('All Reports updated!');
    }
  });
}
  
async function reportsUpdate(list, prop, user) {
  const query = {
    'property.domain': { $in: list },
    'property.property_id': { $in: prop.property_id },
    'report_origin': { $in: prop.property_origin },
    $or: [
      { 'property.refs_to_user': { $exists: false } },
      { 'property.refs_to_user': null }
    ]
  };
  const countDocs = await ReportModel.countDocuments(query);

  if (countDocs === 0) {
    return "No reports for update";
  }

  return await ReportModel.updateMany(query, {
    'property.refs_to_user': user._id,
    'property.am': user.am,
    'property.placement_name': prop.placement_name,
    'commission.commission_number': user.commission.commission_number,
    'commission.commission_type': user.commission.commission_type
  }).then(r => console.log(r.nModified, 'reports updated successful'));
}

module.exports = {
  canReadAllUsers
}
