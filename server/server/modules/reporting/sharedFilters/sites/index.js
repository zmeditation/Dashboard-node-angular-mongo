const mongoose = require("mongoose");
const Users = mongoose.model('User');
const axios = require('axios');
const Base = require('../../../../services/Base');

class SitesList extends Base {
  constructor(opt) {
    super(opt);
    this.config = opt;
  }
  async execute({ body }) {
    try {
      const { permission, id: userTokenId } = body.additional;
      let result = undefined;
      const arrayWithPubId = await this.generatePubIdsArray(userTokenId);
      this.config.options.data.id = arrayWithPubId;
      switch(permission) {
        case 'canReadAllWBidReports':
          result = await this.sendRequest(this.config);
          break;
        case 'canReadWBidAllPubsReports':
          result = await this.sendRequest(this.config);
          break;
        case "canReadWBidOwnPubsReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadOwnWBidReports":
          result = await this.sendRequest(this.config);
          break;
      }
      return {
        success: true,
        results: this.filterForSitesOnly(result),
        name: 'SITES'
      };
    } catch(err) {
      throw err;
    }
  }

  async generatePubIdsArray(id) {
      const user = await this.findUser(id);
      const role = this.getRole(user);

      switch(role) {
        case 'SENIOR ACCOUNT MANAGER': {
          const pubsOfAM = await this.getIdsPubsOfAM(user);
          return pubsOfAM;
        }
        case 'ACCOUNT MANAGER': {
          return user.connected_users.p;
        }
        case 'PUBLISHER': {
          return [user._id];
        }
        default: {
          return [];
        }
      }
  }

  async findUser(id) {
    const user = await Users.find({ "_id": id });
    return user[0];
  }

  getRole(user) {
    return user.role;
  }

  async sendRequest({ options }) {
    return axios.request(options)
      .then(res => {
        return res.data;
      })
      .catch( err => {
        console.error( `Something going wrong -> ${err.response ? err.response.data : err}`);
        return err;
      });
  }

  async getIdsPubsOfAM(user) {
      try {
        const pubs = await Users.find({"_id": { $in: user.connected_users.am } }).then( am => {
          const pubsIds = am.map(el => {
            return el.connected_users.p;
          }).join(',').split(',').filter(str => str !== '');
          return pubsIds;
        });
        user.connected_users.p.forEach(el => {
          pubs.push(el.toString());
        })
        return pubs;
      } catch(err) {
        throw err;
      }
  }

  filterForSitesOnly(data) {
    const result = [];
      data.forEach(el => {
        if (el['name'] && el['name'] !== 'Error') {
          el.domains.forEach(domain => {
            if (domain) {
              result.push(domain.domain);
            }
          })
        }
      })
    return result;
  }
}

module.exports = SitesList;
