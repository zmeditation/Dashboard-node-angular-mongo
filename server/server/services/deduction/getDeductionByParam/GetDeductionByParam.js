const Base = require('../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const { deductionOfPub } = require('./getDeductionByParamSmall');

class GetDeductionByParam extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { additional: { permission }, query } }) {
    try {

      if (permission) {
        let publisherDeductions, error = undefined;

        switch (permission) {
          case 'canReadAllUsers':
          case 'canReadAllPubs':
          case 'canReadOwnPubs':

            ({ publisherDeductions, error } = await deductionOfPub(query));
            break;

          default:
            throw new ServerError('FORBIDDEN', 'FORBIDDEN');
        }

        if (error !== null) {
          throw error;
        }

        return {
          success: true,
          publisherDeductions,
          error
        };
      }
    } catch (error) {
      console.log(error.message && error.message);
      throw new ServerError(`${error && error.msg ? error.msg : 'GET DEDUCTION BY PARAMETER ERROR'}`, 'BAD_REQUEST');
    }
  }
}


module.exports = GetDeductionByParam;