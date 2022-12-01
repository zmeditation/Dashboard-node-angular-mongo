const mongoose = require("mongoose");
const Users = mongoose.model('User');
const Base = require('../../../../../services/Base');
const array = require('../../../../utilities/array/sorting');
const { REPORT_FILTERS } = require('../../../../../constants/reportFilters');

class GetWbidPublishers extends Base {
  constructor(opt) {
    super(opt);
  }
  async execute({ body }) {
    try {
      const { permission, id: userTokenId } = body.additional;
      let result = undefined;
      const queryToFind = await this.queryBuilder(userTokenId);
      switch(permission) {
        case "canReadAllReports":
          result = await this.getPublishers(queryToFind);
          break;
        case "canReadAllPubsReports":
          result = await this.getPublishers(queryToFind);
          break;
        case "canReadAllWBidReports":
          result = await this.getPublishers(queryToFind);
          break;
        case "canReadOwnPubsReports":
          result = await this.getPublishers(queryToFind);
          break;
        case "canReadOwnWBidReports":
          result = await this.getPublishers(queryToFind);
          break;
        case "canReadWBidAllPubsReports":
          result = await this.getPublishers(queryToFind);
          break;
        case "canReadWBidOwnPubsReports":
          result = await this.getPublishers(queryToFind);
          break;
      }
      return {
        success: true,
        results: result.results,
        name: 'PUBLISHERS',
        _id: result._id
      };

    } catch(err) {
      throw err;
    }

  }

  async getPublishers(queryObject) {
    try {
        queryObject.wbidUserId = { $nin: [null, ''] };
        let [ results ] = await Users.aggregate([
            { $match: queryObject },
            { $group: { "_id": REPORT_FILTERS.WBID_PUBLISHERS, "results": { $addToSet : { "name": "$name", "id": "$_id", "domains": "$domains", "enabled": "$enabled.status" }}}},
        ]);

        if (results) {
            results.name = 'PUBLISHERS';
            results.results = array.sortBy(results['results'], { prop: "name" });
        } else {
            results = {
                _id: REPORT_FILTERS.WBID_PUBLISHERS,
                name: 'PUBLISHERS',
                results: []
            }
        }

        return results;
    } catch (e) {
        console.error(e);
    }
  }

  async findCurrentUser(user) {
    const idsArray = [];
    idsArray.push(user._id);
    user.connected_users.am.forEach( el => {
        idsArray.push(el);
    });
    user.connected_users.p.forEach( el => {
        idsArray.push(el);
    });
    return {
        idsArray,
        user: user
    };
  };

  async findPubsOfAM(arr) {
    const allPubsID = [];
    for (const id of arr) {
      const currentUser = await Users.find({ _id: id });
      if (currentUser.length && currentUser[0].role === 'ACCOUNT MANAGER') {
        currentUser[0].connected_users.p.forEach( el => {
          allPubsID.push(el);
        })
      } else if (currentUser.length && currentUser[0].role === 'PUBLISHER') {
        allPubsID.push(currentUser[0]._id);
      }
    }
    return allPubsID;
  };

  filterByRole(user, idsAllPubs) {
    let queryToFind = undefined;
    if (user.role === "CEO MANAGE" || user.role === "CEO") {
        queryToFind = {
            role: "PUBLISHER"
        }
    } else {
        queryToFind = user.role !== 'AD OPS' && user.role !== 'MEDIA BUYER' && user.role !== 'ADMIN' ?
        {
            role: "PUBLISHER",
            _id: { $in: idsAllPubs }
        } : {
            role: "PUBLISHER"
        };
    }
    return queryToFind;
  };

  async queryBuilder(userTokenId) {
    let queryToFind = {
      role: 'PUBLISHER'
    };
    const currentUser = await Users.findOne({ _id: userTokenId });

    if (currentUser.role === 'ACCOUNT MANAGER') {
      const { idsArray, user } = await this.findCurrentUser(currentUser);
      const allPubsID = await this.findPubsOfAM(idsArray);
      queryToFind = this.filterByRole(user, allPubsID);
    }
    return queryToFind;
  }
}

module.exports = GetWbidPublishers;
