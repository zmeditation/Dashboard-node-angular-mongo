const { CSVUploader } = require('../../../modules/reporting/CSVUpload/main');

exports.canAddReports = (csv, origin, userTokenId) => {
  const csvUploader = new CSVUploader();
  return new Promise(async (resolve, reject) => {
    const result = await csvUploader.upload(csv.path, origin, false);
    if (result?.name !== 'Error') {
      resolve(result ? result : false);
    } else {
      reject(result);
    }
  })
};
