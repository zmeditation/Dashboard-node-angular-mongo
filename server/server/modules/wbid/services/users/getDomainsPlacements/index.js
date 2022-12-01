const mongoose = require("mongoose");
const Users = mongoose.model('User');
const axios = require('axios');
const Base = require('../../../../../services/Base');

class GetDomainsPlacements extends Base {
  constructor(opt) {
    super(opt);
    this.config = opt;
  }
  async execute({ body }) {
    try {
      const { permission, id: userTokenId } = body.additional;
      let result = undefined;
      this.config.options.data.id = await this.generatePubIdsArray(userTokenId);
      switch(permission) {
        case "canReadAllReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadAllPubsReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadAllWBidReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadOwnPubsReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadOwnWBidReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadWBidAllPubsReports":
          result = await this.sendRequest(this.config);
          break;
        case "canReadWBidOwnPubsReports":
          result = await this.sendRequest(this.config);
          break;
      }
      return {
        success: true,
        results: result,
        name: 'PLACEMENTS'
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
        console.error( `Something going wrong -> ${err}`);
        return err
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
}

module.exports = GetDomainsPlacements;
