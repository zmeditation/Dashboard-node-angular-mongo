const mongoose = require("mongoose");
const Domains =  mongoose.model("Domains");

const canReadAllUsers = async (params) => {
  try {
    const { user: userId } = params;
    const query = params.user ? { 
                    refs_to_user: { $in: userId }
                  } : params;

    const domains = await Domains.find(query).lean();
    return params.user ? domains.map(el => el.domain) : domains;
  } catch(err) {
    return err; 
  }
}

const canReadAllPubs = async (params) => {
  try {
    const { user: userId } = params;
    const query = params.user ? { 
                    refs_to_user: { $in: userId }
                  } : params;

    const domains = await Domains.find(query).lean();
    return params.user ? domains.map(el => el.domain) : domains;
  } catch(err) {
    return err; 
  }
}

module.exports = {
  canReadAllUsers,
  canReadAllPubs
};