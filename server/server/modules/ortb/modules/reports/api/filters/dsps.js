const { DSP } = require('./res/pg/models');

class DspList {
  constructor() {
  }

  async run() {
    return {
      success: true,
      name: 'DSP',
      results: await this.getDSPList()
    }
  }

  getDSPList = async () => {
    const list = await DSP.findAll();
    return list.map(dsp => dsp.name);
  }
}

module.exports = DspList;
