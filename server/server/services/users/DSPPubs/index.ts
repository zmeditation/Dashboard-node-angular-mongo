const { DSP } = require('../../../../server/modules/ortb/modules/reports/api/filters/res/pg/models.js');

export default class GetDSPPartners {
  constructor() {
  }

  async run() {
    let list = await DSP.findAll();
    return list.map((dsp: any) => {
      return { id: dsp.id.toString(), name: dsp.name }
    }).sort((a: any, b: any) => a.id - b.id);
  }
}
