const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { getAllDeductions, getAllOwnAndAccountDeds } = require('./getAllPubsDedsSmall');

class GetAllPubsDeductions extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { additional: { permission, id: userId } } }) {
    try {
      if (permission) {
        let publishers, error = undefined;

        switch (permission) {

          case 'canReadAllDeductions':
            const getAll = await getAllDeductions();
            publishers = getAll.publishersAndDeductions;
            error = getAll.error;
            break;

          case 'canReadOwnAndAccountDeductions':
            const seniorGet = await getAllOwnAndAccountDeds(userId, 'allPubs');
            publishers = seniorGet.publishersAndDeductions;
            error = seniorGet.error;
            break;

          case 'canReadOwnPublishersDeductions':
            const ownPubsGet = await getAllOwnAndAccountDeds(userId, 'onlyOwnPubs');
            publishers = ownPubsGet.publishersAndDeductions;
            error = ownPubsGet.error;
            break;

          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        return {
          success: true,
          publishers,
          error
        };
      }
    } catch (error) {
      throw new ServerError('GET_DEDUCTIONS_ERROR', 'BAD_REQUEST');
    }
  }
}

module.exports = GetAllPubsDeductions;