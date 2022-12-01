const mongoose = require("mongoose");
const Users = mongoose.model("User");
const ReportModel = mongoose.model("Reports");
const moment = require('moment');
const { ServerError } = require('../../../handlers/errorHandlers');

class AutoDisablePublisher {
  constructor() {

  }

  async init(limit = 1000) {
    try {
      const list = await this.findAllActive();
      const aggregateRequests = await this.aggregateReportsData(list);
      const check = this.check(aggregateRequests, limit);
      const finalStage = await this.finalStage(check, limit);
      return finalStage;
    } catch(error) {
      console.log(error);
      throw new ServerError('ERROR_WHILE_MONITORING_USERS', 'BAD_REQUEST');
    }
  }

  async findAllActive() {
    return await Users.find({
      role: 'PUBLISHER', 
      'enabled.status': true, 
      createdAt: { $lte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(30, "days").toDate() } })
      .select('_id')
      .then(ids => {
        return ids.map(el => el._id);
      })
  }

  async aggregateReportsData(list) {
    const periodQuery = {
      $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(60, "days").toDate(),
      $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(1, "days").toDate()
  };
    const reports = await ReportModel.aggregate([
      { $match: { "property.refs_to_user": { $in: list }, day: periodQuery } },
      { $group: {
        _id: "$property.refs_to_user",
        requests: { $sum: "$ad_request" }
      } }
    ]);
    return reports;
  }

  check(reports, limit) {
    return reports.map(rep => {
      if (rep.requests < limit) {
        return rep._id;
      }
    }).filter(el => el !== undefined);
  }

  async finalStage(list, limit) {
    if (list.length > 0) {
      return await Users.updateMany({ _id: { $in: list } }, { 'enabled.status': false, 'enabled.changed': true }).then(res => {
        return `${res.nModified} publishers ${res.nModified > 1 ? 'were' : 'was'} disabled, because requests less ${limit}`;
      });
    }
    return `All publishers has more, than ${limit} of requests`;
  }
}

module.exports = AutoDisablePublisher;