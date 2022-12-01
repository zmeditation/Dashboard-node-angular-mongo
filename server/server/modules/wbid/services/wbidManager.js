const Base = require('../../../services/Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const axios = require('axios');
const User = require('../../../database/mongoDB/migrations/UserModel');

class WBidManager extends Base {
  constructor(args) {
    super(args);
    this.config = args;
  }

  async execute({ body }) {
    try {
      const { permission, id: userTokenId } = body.additional;
      let result = undefined;
      const allowedPermissions = [
        'canCreateWBidPlacements',
        'canEditWBidPlacements',
        'canDeleteWBidPlacements',
        'canSeeAllWBidUsers',
        'canReadAllReports',
        'canAddAllPubs',
        'canAddAllUsers',
        'canEditAllUsers',
        'canEditAllPubs',
        'canDeleteAllUsers',
        'canSeeWBidStatusAdsTxt',
        'canEditWBidSites',
        'canSeeOwnWBidSettings',
        'canReadOwnWBidReports',
        'canReadAllWBidReports',
        'canSeeWBidPlacementHistory',
        'canSeeWBidIntegrationPage',
        'canReadAllPubsReports',
        'canPreviewWBidPlacements'
      ];
      const allowedPermissionsLimited = [
        'canAddOwnPubs',
        'canEditOwnPubs',
        'canSeeOwnWBidUsers',
        'canReadOwnPubsReports',
        'canReadWBidOwnPubsReports',
        'canReadWBidAllPubsReports'
      ];
      if (allowedPermissions.includes(permission)) {
        result = await this.sendRequest(this.config);
      } else if (allowedPermissionsLimited.includes(permission)) {
        if (this.config.args.body.path === '/getUsersList') {
          const preResult = await this.sendRequest(this.config);
          result = await this.canSeeOwnWBidUsers(preResult, userTokenId)
        } else {
          result = await this.sendRequest(this.config);
        }
      } else {
        throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }
      return {
        success: true,
        name: result.name,
        results: result.results || result
      };
    } catch (err) {
      throw new ServerError(err, 'BAD_REQUEST');
    }
  }

  async sendRequest({ options }) {
    return axios.request(options)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        console.error(`Something going wrong -> ${ err }`);
        return err
      });
  }

  async canSeeOwnWBidUsers(res, userTokenId) {
    const am = await User.find({ '_id': userTokenId })
      .populate({
        path: 'connected_users.p',
        select: 'wbidUserId'
      });
    const arrWbidIds = am[0].connected_users.p.map(el => el.wbidUserId).filter(id => id !== null);
    const result = [];
    if (arrWbidIds.length) {
      for (const pub of res.users) {
        arrWbidIds.includes(pub.userData.id) === true ? result.push(pub) : '';
      }
    } else if (!arrWbidIds.length) {
      result.push({ userData: { id: 'NO_WBID_USERS_YET' }, sites: 0 });
    }
    return {
      users: result
    };
  }
}

module.exports = WBidManager;
