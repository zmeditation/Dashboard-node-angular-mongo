const mongoose = require('mongoose');
const Users = mongoose.model('User');
const Base = require('../../../../services/Base');
const { ServerError } = require('../../../../handlers/errorHandlers');
const { REPORT_FILTERS } = require('../../../../constants/reportFilters');

class PermissionCheck extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { request: reportReq, additional: { permission, id: userToken } } }) {
    const filtersIncluded = reportReq.filters.map(el => el.name);
    let permissionPass,
        result;
    try {
      switch(permission) {
        case 'canReadAllWBidReports':
          result = await this.getResults(reportReq);
          break;
        case 'canReadWBidAllPubsReports':
          if (!filtersIncluded.includes('PUBLISHERS')) {
            permissionPass = await this.canReadWBidAllPubsReports(userToken);
            reportReq.filters.push( {
              filterId: REPORT_FILTERS.WBID_PUBLISHERS,
              name: 'PUBLISHERS',
              values: permissionPass,
              type: 'include'
            });
          }
          result = await this.getResults(reportReq);
          break;
        // case 'canReadAllWBidReports':

        //   result = await this.getResults(reportReq);
        //   break;
        case 'canReadWBidOwnPubsReports':
          if (!filtersIncluded.includes('PUBLISHERS')) {
            permissionPass = await this.canReadWBidOwnPubsReports(userToken);
            reportReq.filters.push( {
              filterId: REPORT_FILTERS.WBID_PUBLISHERS,
              name: 'PUBLISHERS',
              values: permissionPass,
              type: 'include'
            });
          }
          result = await this.getResults(reportReq);
          break;
        case 'canReadOwnWBidReports':
          if (!filtersIncluded.includes('PUBLISHERS')) {
            reportReq.filters.push( {
              filterId: REPORT_FILTERS.WBID_PUBLISHERS,
              name: 'PUBLISHERS',
              values: [userToken],
              type: 'include'
            });
          }
          result = await this.getResults(reportReq);
          break;
        default:
          throw new ServerError('FORBIDDEN', 'FORBIDDEN');
      }
    } catch (err) {
      throw new ServerError('FORBIDDEN', 'FORBIDDEN');
    }
    return result;
  }

  canReadWBidAllPubsReports(id) {
    const promise = Users.find({ _id: id });
    const publishers = promise.then(async user => {
      const res = user[0].connected_users.p;
      await Users.find({ _id: { $in: [user[0].connected_users.am] } }).then(am_users => {
        for (let i of am_users) {
          i.connected_users.p.forEach(el => {
            if (!res.includes(el)) {
              res.push(el);
            }
          })
        }
      })
      return res;
    });
    return publishers;
  }

  canReadWBidOwnPubsReports(id) {
    const promise = Users.find({ _id: id });
    const publishers = promise.then(async user => {
      const res = user[0].connected_users.p;
      return res;
    });
    return publishers;
  }

}

module.exports = PermissionCheck;
