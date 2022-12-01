import { SSP } from '../../../modules/ortb/modules/reports/api/filters/res/pg/models';

export default class GetSSPPartners {
  constructor() {
  }

  async run() {
    let list = await SSP.findAll();
    return list.map((ssp: any) => {
      return { id: ssp.id, name: ssp.name, enable: ssp.enable, secret_key: ssp.secret_key }
    }).sort((a: any, b: any) => a.id - b.id);
  }
}
