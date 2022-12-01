const mongoose = require("mongoose");
const Domains = mongoose.model("Domains");
const moment = require('moment');

const canReadAllUsers = async (params, userId) => {
  try {
    const status = await addDomain(params.domain, userId);

    return { status, domain: params.domain, errors: null };
    
  } catch(err) {

    return { domain: params.domain, errors: err };

  }

};

const addDomain = async (domain, userId, pubId = undefined) => {
  const domainObject = {
    domain: domain,
    last_modify: {
      user: userId,
      date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      changes: 'just created'
    },
    refs_to_user: []
  };
  if (pubId) {
    domainObject.refs_to_user.push(pubId);
    domainObject.enabled = true;
  }
  const status = await Domains.create(domainObject).catch((e) => undefined);
  
  return status;
}

module.exports = {
  canReadAllUsers,
  addDomain
};