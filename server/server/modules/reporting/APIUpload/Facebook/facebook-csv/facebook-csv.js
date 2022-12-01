const csv = require('csvtojson/v1');
const { handleErrors } = require('../../../../../services/helperFunctions/handleErrors');
const { checkResponseOnError } = require('../../../../../handlers/checkResponseOnError');
const sendReport = require('../../../../../services/reporting/UploadAPIReports/helperFunctions/sendReport');

const programmatic = 'Facebook';
const sendReportMessage = {
  event: 'reports',
  trigger: programmatic,
  typeMsg: 'error',
  text: null
};

const convertFacebookCSVToJSON = (csvPath) => {
  return new Promise((resolve) => {
    const customText = `${this.programmatic}, error in convertFacebookCSVToJSON`;

    try {
      const objectArray = [];

      csv()
        .fromFile(csvPath)
        .on('json', (json) => {
          const object = createJSONObject(json);
          objectArray.push(object);
        })
        .on('done', () => {
          const convertedJSONObjectArray = cutUnneededProperties(objectArray);
          resolve(convertedJSONObjectArray);
        });
    } catch (error) {
      checkResponseOnError({ error, customText }).catch(() => sendReport({ message: sendReportMessage }));
      handleErrors(error, programmatic);
    }
  });
};

function cutUnneededProperties(array) {
  return array.map((array) => {
    return {
      name: array['Property'],
      id: array['Placement ID'],
      placement_name: array['Placement Name']
    };
  });
}

function createJSONObject(json) {
  json['Property'] = /\"(.*?)\"/gm.exec(json['Property'])[1];
  json['Placement ID'] = /\"(.*?)\"/gm.exec(json['Placement ID'])[1];

  // const object = {};
  //
  // const keys = Object.keys(json);
  // const keyArr = keys[0].split('\t');
  //
  // const value = json[keys];
  // const valueArr = value.split('\t');
  //
  // keyArr.forEach((key, index) => {
  //     object[key] = valueArr[index];
  // });
  //
  // return object;
  return json;
}

module.exports = convertFacebookCSVToJSON;
