const { Op } = require("sequelize");
const { SSP_Domain } = require('./res/pg/models');

class SspDomainsList {
  constructor(req) {
    this.query = req.args.query;
  }

  async run() {
    return {
      success: true,
      name: 'DOMAINS',
      results: await this.getSSPDomains(this.query)
    }
  }

  getSSPDomains = async (query) => {
    const searchQuery = `%${ query.search }%`;
    const id = parseInt(query.id) !== -1 ? parseInt(query.id) : undefined;
    let DOMAINS;

    if (id) {
      DOMAINS = await SSP_Domain.findAll({     // search all case-insensitive matches in postgres
        where: { domain: { [Op.iLike]: searchQuery }, ssp_id: id },
        attributes: ['id', 'ssp_id', 'domain', 'enable']
      });
    } else {
      DOMAINS = await SSP_Domain.findAll({
        where: { domain: { [Op.iLike]: searchQuery } },
        attributes: ['id', 'ssp_id', 'domain', 'enable']
      });
    }

    // filter and sort data before sending
    return DOMAINS.map(domain => domain['dataValues'])
      .filter((v, i, a) => a.findIndex(t => (t.domain === v.domain)) === i)
      .sort((a, b) => a.domain > b.domain ? 1 : -1);
  }
}

module.exports = SspDomainsList;

