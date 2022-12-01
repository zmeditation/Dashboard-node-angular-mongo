const fsPromises = require('fs').promises;
const mongoose = require("mongoose");
const ReportModel = mongoose.model("Reports");
const moment = require('moment');

class MainAnalyticsService {

	constructor() {
    this.datesRangeDefault = {
      from: moment().subtract(31, 'days').toDate(),
      to: moment().subtract(0, 'days').toDate()
    };
    this.createAtRangeDefault = {
      from: new Date(2000, 0),
      to: new Date()
    };
  }

	// Function also for detect not valid commission_type
	// filtration can do in query
	filterPublishersIdByCommissionsType(publishers) {
		const acceptedCommissionTypes = ['eCPM', 'Impressions'];
  
    return publishers.map(pub => {
      const commission_type = pub.commission && pub.commission.commission_type;
  
      if (acceptedCommissionTypes.includes(commission_type)) {
        return pub._id;
      } 
      console.error(`Publisher with the ${pub._id} _id has wrong commission type ...`);
    });
	}

	async getPublishersReportsRevenue(params) {
		const { datesRange: { from, to }, publishersId } = params;

    const aggregatedReports = await ReportModel.aggregate(
      [
        { $match: { "property.refs_to_user": { $in: publishersId }, day: { $gte: from, $lte: to } } },
        { $sort: { "date" : 1 } },
        { $group: this.returnQueryObject() }
      ]
    )
    .allowDiskUse(true);
  
    aggregatedReports.forEach(report => {
      report.date = moment(report.date).format('YYYY-MM-DD');
    });
    
    return aggregatedReports;
  }

  returnQueryObject() {
    return {
      "_id": { user_id: "$property.refs_to_user", day: { $dayOfMonth: "$day" }, month: { $month: "$day" }},
      "date": { $first: "$day"},
      "revenue": { $sum: { $cond: { 
        if: { $eq: [ '$commission.commission_type', 'eCPM' ] }, 
        then: { $multiply: [{ $divide: ["$matched_request", 1000] }, { $subtract : ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$ecpm"] }]}] },
        else: { $multiply: [{ $divide: [{ $subtract : ["$matched_request", { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$matched_request"] }]}, 1000] }, "$ecpm"] }
      } } }
    };
  }

  getDateIntervals(params) {
    const { datesRange: { from, to } , interval } = params;
    if (interval === 'total') { return [] }
  
    let startCountDate = moment(from);
    const stopCountDate = moment(to).set({ hours: 0, minutes: 0, seconds: 0 });
    const dateIntervals = [];
  
    if (interval === 'daily') {
      while (startCountDate < stopCountDate) {
        dateIntervals.push(moment(startCountDate).format('YYYY-MM-DD'));
        startCountDate = moment(startCountDate).add(1, 'days')
      }
    } else if (interval === 'monthly') {
      while (startCountDate < stopCountDate) {
        dateIntervals.push(startCountDate.format('YYYY-MM'));
        startCountDate = startCountDate.add(1,'month');
      }
    }
  
    return dateIntervals;
  }

	async writeAnalytics(params) {
		const { writeInFile, analyticsObj, pathToFile } = params;

		if (writeInFile) {
			const writeData = JSON.stringify(analyticsObj);
			await fsPromises.writeFile(pathToFile, writeData);
		}
	}
}

module.exports = MainAnalyticsService;