const Base = require('../../Base');
const { canReadAllDeductions, canReadOwnAndAccountDedsByType, canReadOwnDeductions } = require('./getDeductionSmall');
const { checkResponseOnError } = require('../../../handlers/checkResponseOnError');
const { handleErrors } = require('../../helperFunctions/handleErrors');

class GetPubsDeductions extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { additional: { permission, id: userId } }, query: { query } }) {
    try {
      const queryObj = JSON.parse(query);
      const getFuncByPermission = {
        'canReadAllDeductions': async () => await canReadAllDeductions(queryObj),
        'canReadOwnAndAccountDeductions': async () => await canReadOwnAndAccountDedsByType(queryObj, userId, 'allPubs'),
        'canReadOwnPublishersDeductions': async () => canReadOwnAndAccountDedsByType(queryObj, userId, 'onlyOwnPubs'),
        'canReadOwnDeductions': async () => await canReadOwnDeductions(queryObj, userId)
      };

      const funcByPermission = getFuncByPermission[permission];
      if (!funcByPermission) {
        throw { statusCode: 403 };
      }

      const publishers = await funcByPermission();

      return {  publishers };
    } catch (error) {
      const customText = 'Error in GetPubsDeductions';

      handleErrors(error, customText);
      await checkResponseOnError({ response: error, error, customText, runNext: false });
    }
  }
}


module.exports = GetPubsDeductions;
