import { DSP, SSP } from '../../../modules/ortb/modules/reports/api/filters/res/pg/models';
const { ServerError } = require('../../../handlers/errorHandlers');

export type AddPartnersRequest = {
  name: string,
  type: 'SSP' | 'DSP',
  secret_key?: string,
  endpoint?: string
}

export default class AddRTBUser {
  private readonly req: AddPartnersRequest;

  private readonly map = {
    'SSP': SSP,
    'DSP': DSP
  }

  constructor(request: { args: { body: AddPartnersRequest } }) {
    this.req = request.args.body;
  }

  async run() {
    let result;
    const { name, type, secret_key } = this.req;
    const check = await this.checkIfPartnerExists(type, name);
    if (check) {
      return {
        success: false,
        result: 'PARTNER_EXIST'
      }
    }
    switch (type) {
      case 'SSP':
        result = await SSP.create({
          name, secret_key
        });

        return {
          success: true,
          result
        }
      case 'DSP':
        result = await DSP.create({
          name
        });

        return {
          success: true,
          result
        }

      default:
        throw new ServerError('BAD_REQUEST', 'BAD_REQUEST')
    }
  }

  async checkIfPartnerExists(type: 'SSP' | 'DSP', name: string): Promise<boolean> {
    const model = this.map[type];
    const user = await model.findOne({ where: { name: name } });
    return !!user;
  }
}
