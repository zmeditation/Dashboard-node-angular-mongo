const Base = require('../../Base');
const { CDN } = require("../../../modules/wbid/services/CDN/controller");
const { codeModel } = require('../../../modules/codes/database/models');
const cdn = new CDN();

class DeletePackCode extends Base {
  constructor(args) {
    super(args);
  }

  async execute(data) {
    const { id } = data.query;
    const targetPack = await codeModel.findAll({ where: { id } });
    if (targetPack) {
      const { link } = targetPack[0]['dataValues'];
      await cdn.deleteFromCDN(link);
      await codeModel.destroy({ where: { id } });
    }

    return targetPack ? {
      success: true,
      deletedPack: id
    } : {
      success: false
    }
  }

}

module.exports = DeletePackCode;
