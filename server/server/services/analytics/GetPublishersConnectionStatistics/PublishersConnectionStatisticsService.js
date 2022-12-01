const fs = require('fs');
const fsPromise = fs.promises;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Reports = mongoose.model('Reports');
const { handleErrors } = require('../../helperFunctions/handleErrors');
const HandleAnalyticsFiles = require('../handleAnalyticsFiles');
const PublishersAnalyticsService = require('../PublishersAnalytics/PublishersAnalyticsService');

class PublishersConnectionStatisticsService {
  constructor(minRevenue) {
    this.pubsCountFilePath = `${__dirname}/../storage/publishersCountByMonth.json`;
    this.handleAnalyticsFiles = new HandleAnalyticsFiles(this.pubsCountFilePath);
    this.publishersAnalyticsService = new PublishersAnalyticsService();
    this.publishersCountByMonth = this.createObjPublishersCountByMonth();
    this.minRevenue = minRevenue;
  }

  // Main Method
  async getPubsCountByMonth() {
    try {
      const isExistFile = fs.existsSync(this.pubsCountFilePath);

      if (isExistFile) {
        const pubsCountByMonthJSON = await fsPromise.readFile(this.pubsCountFilePath, 'utf8');
        const pubsCountByMonth = JSON.parse(pubsCountByMonthJSON);

        return pubsCountByMonth;
      }

      const writeData = JSON.stringify(this.publishersCountByMonth);
      await this.handleAnalyticsFiles.writeFile(writeData);

      const dateRange = this.getCurrentYearRange();
      const pubsCountByMonthNew = await this.getPublishersCountAnalytics({ dateRange });

      return pubsCountByMonthNew;
    } catch (error) {
      throw handleErrors(error, 'getPubsCountByMonth').error;
    }
  }

  getCurrentYearRange() {
    const nowDate = new Date();
    const fullYear = nowDate.getFullYear();
    const firstMonth = 0;
    const firstDateOfYear = new Date(fullYear, firstMonth);

    return {
      from: firstDateOfYear,
      to: nowDate
    };
  }

  async getPublishersCountAnalytics(params) {
    try {
      const { dateRange } = params;
      if (!dateRange) throw `dateRange is ${dateRange}`;

      const { from, to } = dateRange;
      if (!from) throw `from is ${from}`;
      if (!to) throw `to is ${to}`;

      const publishersByRange = await this.getAllPublishersByRange({ dateRange });
      await this.addPublishersToCreatedMonths([...publishersByRange]);
      const publishersId = publishersByRange.map((pub) => pub._id);
      const publishersReports = await this.getPublishersReports({ publishersId, dateRange });

      const rewritePublishersParam = {
        reports: [...publishersReports],
        publishers: [...publishersByRange],
        minRevenue: this.minRevenue
      };
      const newPublishersCountByMonth = await this.rewritePublishersCountByMonth(rewritePublishersParam);

      const writeData = JSON.stringify(newPublishersCountByMonth);
      await fsPromise.writeFile(this.pubsCountFilePath, writeData);

      return newPublishersCountByMonth;
    } catch (error) {
      throw handleErrors(error, 'getPublishersCountAnalytics').error;
    }
  }

  async getAllPublishersByRange(params) {
    const {
      dateRange: { from, to }
    } = params;
    const acceptedCommissionTypes = ['eCPM', 'Impressions'];

    return await User.find(
      {
        role: { $eq: 'PUBLISHER' },
        $or: [{ am: { $type: 'objectId' } }, { sam: { $type: 'objectId' } }],
        'commission.commission_type': { $in: acceptedCommissionTypes },
        createdAt: { $gte: from, $lte: to }
      },
      '_id createdAt name'
    ).lean();
  }

  async addPublishersToCreatedMonths(publishers) {
    publishers.forEach((publisher) => {
      const createdMonth = new Date(publisher.createdAt).toString().split(' ')[1];
      const addCreatedPublisherNum = 1;
      this.publishersCountByMonth[createdMonth].created.count += addCreatedPublisherNum;
      this.publishersCountByMonth[createdMonth].created.publisherNames.push(publisher.name);
    });
  }

  async getPublishersReports(params) {
    const {
      publishersId,
      dateRange: { from, to }
    } = params;

    const aggregatedReports = await Reports.aggregate([
      { $match: { 'property.refs_to_user': { $in: publishersId }, day: { $gte: from, $lte: to } } },
      { $sort: { date: 1 } },
      { $group: this.returnQueryObject() }
    ]).allowDiskUse(true);

    return aggregatedReports;
  }

  returnQueryObject() {
    const commissionTypes = {
      _id: { user_id: '$property.refs_to_user' },
      revenue: {
        $sum: {
          $cond: {
            if: { $eq: ['$commission.commission_type', 'eCPM'] },
            then: {
              $multiply: [
                { $divide: ['$matched_request', 1000] },
                { $subtract: ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$ecpm'] }] }
              ]
            },
            else: {
              $multiply: [
                {
                  $divide: [
                    {
                      $subtract: [
                        '$matched_request',
                        { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$matched_request'] }
                      ]
                    },
                    1000
                  ]
                },
                '$ecpm'
              ]
            }
          }
        }
      }
    };

    return commissionTypes;
  }

  async rewritePublishersCountByMonth(params) {
    const { reports, publishers, minRevenue } = params;

    reports.forEach((report) => {
      if (report.revenue >= minRevenue) {
        const pubEarned = publishers.find((publisher) => {
          return publisher._id.toString() === report._id.user_id.toString();
        });

        this.addPublisherToEarn(pubEarned);
      }
    });

    return this.publishersCountByMonth;
  }

  addPublisherToEarn(publisher) {
    const createdMonth = new Date(publisher.createdAt).toString().split(' ')[1];
    const addEarnedPublisherNum = 1;
    this.publishersCountByMonth[createdMonth].earned.count += addEarnedPublisherNum;
    this.publishersCountByMonth[createdMonth].earned.publisherNames.push(publisher.name);
  }

  createObjPublishersCountByMonth() {
    const monthCount = 11;
    const defaultYear = 2020;
    const defaultCountValue = 0;
    const monthsHaveValuesObj = {};

    for (let i = 0; i <= monthCount; ++i) {
      const monthName = new Date(defaultYear, i).toString().split(' ')[1];
      monthsHaveValuesObj[monthName] = {
        created: {
          count: defaultCountValue,
          publisherNames: []
        },
        earned: {
          count: defaultCountValue,
          publisherNames: []
        }
      };
    }

    return monthsHaveValuesObj;
  }
}

module.exports = PublishersConnectionStatisticsService;
