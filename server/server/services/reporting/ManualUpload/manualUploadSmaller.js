const { processManualReports } = require('./manualUploadHelpers');

exports.canAddReports = (reportsObject, userTokenId) => {
  return new Promise(resolve => {
      const permission = 'canAddReports';

      const message = processManualReports(reportsObject, permission, userTokenId);
      
      resolve(message ? message : false);
  })
};

exports.canAddOwnPubsReports = (reportsObject, userTokenId) => {
  return new Promise(async resolve => {
      const permission = 'canAddOwnPubsReports';

      const message = processManualReports(reportsObject, permission, userTokenId);

      resolve(message ? message : false);
  })
};
