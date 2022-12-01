const { ServerError } = require('../../../handlers/errorHandlers');
const mongoose = require("mongoose");
const Properties =  mongoose.model("Property");


const GetUsersProperties = async (req, res) => {
  try {
    const { body, query } = req;
    const result = await Properties.find({ refs_to_user: query.user }, 'placement_name property_id property_origin property_description')
    .lean()
    .then(units => {
      const tempArray = [];
      return units.map(el => {
        const uniqueString = el.property_id + el.property_origin;
        if (!tempArray.includes(uniqueString)) {
          tempArray.push(uniqueString);
          return el;
        }
      }).filter(el => el !== undefined);
    });
    
    res.send(result);
  } catch(err) {
    throw new ServerError(err.message, 'BAD_REQUEST');
  }

};

module.exports = {
  GetUsersProperties
};