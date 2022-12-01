const mongoose = require('mongoose');
const ReportModel = mongoose.model("Reports");
const User = mongoose.model("User");

const moment = require("moment");

exports.canReadAllReports = gfc => {
  return new Promise(async resolve => {
      const users = parseUsers(await User.find({ role: "PUBLISHER" }));
      resolve(queryMonthly(users, gfc));
  });
};

exports.canReadAllPubsReports = gfc => {
  return new Promise(async resolve => {
      const users = parseUsers(await User.find({ role: "PUBLISHER", am: { $exists: true } }));
      resolve(queryMonthly(users, false));
  });
};

exports.canReadOwnPubsReports = (gfc, userTokenId) => {
    return new Promise(async resolve => {
        const users = parseUsers(await User.find({ role: "PUBLISHER", am: userTokenId }));
        resolve(queryMonthly(users, false));
    })
};

exports.canReadOwnReports = (gfc, userTokenId) => {
    return new Promise(async resolve => {
        const users = parseUsers(await User.find({ role: "PUBLISHER", _id: userTokenId }));
        resolve(queryMonthly(users, false));
    })
};

const queryMonthly = async (users, gfc = false) => {

    const dates = {
        cMEnd: moment().toDate(),
        cMStart: moment()
            .startOf("month")
            .toDate(),
        lMStart: moment()
            .subtract(1, "months")
            .startOf("month")
            .toDate(),
        lMEnd: moment()
            .subtract(1, "months")
            .toDate()
    };

    let arrReports = users.map(el => el.id);
    const reportsByImpressionsThisMonth = await aggregateByCommissionType(arrReports, "Impressions", 'thisMonth', dates.cMStart, dates.cMEnd);
    const reportsByCPMThisMonth = await aggregateByCommissionType(arrReports, "eCPM", 'thisMonth', dates.cMStart, dates.cMEnd);

    const reportsByImpressionsLastMonth = await aggregateByCommissionType(arrReports, "Impressions", 'lastMonth', dates.lMStart, dates.lMEnd);
    const reportsByCPMLastMonth = await aggregateByCommissionType(arrReports, "eCPM", 'lastMonth', dates.lMStart, dates.lMEnd);

    const thisMonth = {
        _id: `thisMonth`,
        totalRequests: reportsByImpressionsThisMonth[0] ? (+reportsByImpressionsThisMonth[0].totalRequests + +reportsByCPMThisMonth[0].totalRequests) : 0,
        totalImpressions: reportsByImpressionsThisMonth[0] ? (+reportsByImpressionsThisMonth[0].totalImpressions + +reportsByCPMThisMonth[0].totalImpressions) : 0,
        averageCPM: reportsByImpressionsThisMonth[0] ? ((+reportsByImpressionsThisMonth[0].averageCPM + +reportsByCPMThisMonth[0].averageCPM) / 2) : 0,
        revenue: reportsByImpressionsThisMonth[0] ? (+reportsByImpressionsThisMonth[0].revenue + +reportsByCPMThisMonth[0].revenue) : 0,
    };

    const lastMonth = {
        _id: `lastMonth`,
        totalRequests: reportsByImpressionsLastMonth[0] ? (+reportsByImpressionsLastMonth[0].totalRequests + +reportsByCPMLastMonth[0].totalRequests) : 0,
        totalImpressions: reportsByImpressionsLastMonth[0] ? (+reportsByImpressionsLastMonth[0].totalImpressions + +reportsByCPMLastMonth[0].totalImpressions) : 0,
        averageCPM: reportsByImpressionsLastMonth[0] ? ((+reportsByImpressionsLastMonth[0].averageCPM + +reportsByCPMLastMonth[0].averageCPM) / 2) : 0,
        revenue: reportsByImpressionsLastMonth[0] ? (+reportsByImpressionsLastMonth[0].revenue + +reportsByCPMLastMonth[0].revenue) : 0,
    }

    const previousMonth = formatQueryResult(lastMonth);
    const currentMonth = formatQueryResult(thisMonth);


    return { currentMonth, previousMonth };
};

function parseUsers(users) {
    return users.map(user => {
        return { id: user._id, commission: user.commission };
    });
}

function formatQueryResult(result) {
    result.averageCPM = result.averageCPM.toFixed(2);
    result.revenue = result.revenue.toFixed(2);
    result.totalImpressions = Math.round(result.totalImpressions);
    result.totalRequests = Math.round(result.totalRequests);
    return result;
}

async function aggregateByCommissionType(arr, type, name, startDate, endDate) {
    return await ReportModel.aggregate(
        [
            { $sort: { "date" : 1, "ad_request": -1, "matched_request": -1 } },
            { $match: 
                {
                    "property.refs_to_user": { $in: arr },
                    "commission.commission_type": type, 
                    "day": { $gte: startDate, $lte: endDate }
                }
            },
            { $group: {
                "_id": `${name}`,
                "totalRequests": { $sum: "$ad_request" },
                "totalImpressions": { $sum: { $cond: { if: { $eq: [ '$commission.commission_type', 'Impressions' ] }, then: { $subtract : ["$matched_request", { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$matched_request"] }]}, else: "$matched_request" } } },
                "averageCPM": { $avg: { $cond: { if: { $eq: [ '$commission.commission_type', 'eCPM' ] }, then: { $subtract : ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$ecpm"] }]}, else: "$ecpm" } } },
                "revenue": { $sum: { $cond: { 
                    if: { $eq: [ '$commission.commission_type', 'eCPM' ] }, 
                    then: { $multiply: [{ $divide: ["$matched_request", 1000] }, { $subtract : ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$ecpm"] }]}] },
                    else: { $multiply: [{ $divide: [{ $subtract : ["$matched_request", { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$matched_request"] }]}, 1000] }, "$ecpm"] }
                 } } }
                } 
            }
        ]).allowDiskUse(true);
}