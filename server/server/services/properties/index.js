const mongoose = require('mongoose');
const Properties = mongoose.model("Property");

async function SaveUniqueUnits(props, programmatic) {
  try {
    return await Properties.find({ property_origin: programmatic }).then(views => {
      const forSave = [];
      const savedProperties = [];
      if (views.length > 0) {

        // Create array with unique strings of saved properties for check

        for (const j of views) {
          const uniqueString = j.property_id + j.domain;
          savedProperties.push(uniqueString);
        }

        /**
         * @type {Set<Array>}
         */
        const setOfProperties = new Set(savedProperties);
        const arrWithoutRepeats = Array.from(setOfProperties);

        // Create array with unique strings of incoming properties (property_id+domain)
        // And array with objects for saving

        for (const i of props) {
          const uniqueString = i.property.property_id + i.property.domain;
          if (!arrWithoutRepeats.includes(uniqueString) && i.ad_request > 9) {
            const propertyParams = {
              property_id: i.property.property_id,
              property_origin: i.report_origin,
              domain: i.property.domain
            };
            forSave.push(propertyParams);
          }
        }
      } else {
        for (const j of props) {
          const propertyParams = {
            property_id: j.property.property_id,
            property_origin: j.report_origin,
            domain: j.property.domain
          };
          const uniqueString = propertyParams.property_id + propertyParams.domain;
          const arrWithoutRepeats = [];
          if (!arrWithoutRepeats.includes(uniqueString) && j.ad_request > 9) {
            arrWithoutRepeats.push(uniqueString);
            forSave.push(propertyParams);
          }
        }
      }
      if (forSave.length !== 0) {
        return Properties.insertMany(forSave).then((e) => {
          return `Units saved - ${ forSave.length }`;
        });
      } else {
        return 'No new units for saving';
      }
    });
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  SaveUniqueUnits
};
