const User = require('../../../database/mongoDB/migrations/UserModel');
const { handleErrors } = require('../../helperFunctions/handleErrors');
const MainAnalyticsService = require('../MainAnalyticsService');

class ManagersAnalyticsService extends MainAnalyticsService {
  constructor() {
    super();
    this.notValidManagers = ['5e2039a79779d24e21a3496d', '5e203a4f9779d24e21a35cd9', '5ff497a95139155fb0270020', '5ff497d25139155fb0270021'];
  }

  // Main method
  async getManagersAnalytics(params) {
    try {
      const { pathToFile, datesRange = this.datesRangeDefault, interval = 'daily', writeInFile = true } = params;
      if (!datesRange.from) {
        throw `datesRange.from is ${datesRange.from}`;
      }
      if (!datesRange.to) {
        throw `datesRange.to is ${datesRange.to}`;
      }

      const managersWithPubs = await this.getManagersWithPubs();
      const managersWithPubsId = this.assignCorrectConnectedPublishers(managersWithPubs);
      const publishersId = this.collectPublishersId(managersWithPubsId);
      const pubsRepotrsRev = await this.getPublishersReportsRevenue({ datesRange, publishersId });
      const dateIntervalsArr = this.getDateIntervals({ datesRange, interval });
      const publishersAnalytics = await this.setPubsAnalytics({ publishersId, pubsRepotrsRev, dateIntervalsArr });
      const managersAndPubsAnalytics = await this.assignPublishersThemManagers(managersWithPubsId, publishersAnalytics);
      const managersWithSumAnalytics = await this.sumRevenueManagersPublishers(managersAndPubsAnalytics, dateIntervalsArr);
      const managers = this.clearNeedLessFields(managersWithSumAnalytics);

      const lastUpdate = new Date().getTime();
      const analyticsObj = {
        success: true,
        msg: 'SUCCESSFUL_REQUEST',
        analytics: managers,
        last_update: lastUpdate
      };

      await this.writeAnalytics({ writeInFile, analyticsObj, pathToFile });

      return analyticsObj;
    } catch (error) {
      const customText = 'Error in getManagersAnalytics';
      throw handleErrors(error, customText).error;
    }
  }

  async getManagersWithPubs() {
    return await User.find(
      {
        role: { $in: ['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER'] },
        _id: { $nin: this.notValidManagers },
        'connected_users.p.0': { $exists: true }
      },
      '_id name photo'
    )
      .populate({
        path: 'connected_users.p',
        select: '_id commission.commission_type'
      })
      .lean();
  }

  assignCorrectConnectedPublishers(managersWithPubs) {
    managersWithPubs.forEach((man) => {
      man.connected_publishers = this.filterPublishersIdByCommissionsType(man.connected_users.p);
    });

    return managersWithPubs;
  }

  collectPublishersId(managersWithPubsId) {
    const publishersId = [];

    managersWithPubsId.forEach((man) => {
      publishersId.push(...man.connected_publishers);
    });

    return publishersId;
  }

  async setPubsAnalytics(params) {
    const { publishersId, pubsRepotrsRev, dateIntervalsArr } = params;
    const firstIndex = 0;
    const lastIndex = publishersId.length - 1;
    const publishersAnalytics = [];

    const loopOverPubs = {
      from: firstIndex,
      to: lastIndex,
      setSortAnalytics: this.setAndSortAnalytics.bind(this),

      [Symbol.asyncIterator]() {
        return {
          current: this.from,
          last: this.to,
          setAndSortFunc: this.setSortAnalytics,

          async next() {
            if (this.current <= this.last) {
              const analyticsOfPub = await this.setAndSortFunc({
                publisherId: publishersId[this.current],
                pubsRepotrsRev,
                dateIntervalsArr
              });
              publishersAnalytics.push({
                publisherId: publishersId[this.current],
                analyticsOfPub
              });
              this.current++;

              return { done: false, value: publishersId[this.current - 1] };
            } else {
              return { done: true };
            }
          }
        };
      }
    };

    for await (const publisher of loopOverPubs) {
      // publisher - publisher with analytics
    }

    return publishersAnalytics;
  }

  async setAndSortAnalytics(params) {
    const { publisherId, pubsRepotrsRev, dateIntervalsArr } = params;
    const analytics = [];

    pubsRepotrsRev.forEach((report) => {
      if (publisherId.toString() === report._id.user_id.toString()) {
        analytics.push({ date: report.date, revenue: report.revenue });
      }
    });

    const analyticsDates = analytics.map((obj) => obj.date);
    dateIntervalsArr.forEach((date) => {
      if (!analyticsDates.includes(date)) {
        analytics.push({ date, revenue: 0 });
      }
    });

    return analytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  assignPublishersThemManagers(managers, publishersAnalytics) {
    return new Promise((resolve) => {
      managers.forEach((man) => (man.publishers_analytics = []));

      publishersAnalytics.forEach((pub) => {
        managers.forEach((man) => {
          if (man.connected_publishers.includes(pub.publisherId)) {
            man.publishers_analytics.push(pub.analyticsOfPub);
          }
        });
      });

      resolve(managers);
    });
  }

  sumRevenueManagersPublishers(managers, dateIntervalsArr) {
    return new Promise((resolve) => {
      const dateCount = dateIntervalsArr.length;
      const iterateArray = Array(dateCount).fill(1);
      managers.forEach((man) => (man.analytics = []));

      iterateArray.forEach((_, indexForAnalytic) => {
        managers.forEach((man) => {
          let revenue = 0;

          man.publishers_analytics.forEach((analytic) => {
            revenue += analytic[indexForAnalytic].revenue;
          });

          man.analytics.push({
            date: dateIntervalsArr[indexForAnalytic],
            revenue: revenue.toFixed(2)
          });
        });
      });

      resolve(managers);
    });
  }

  clearNeedLessFields(managers) {
    managers.forEach((man) => {
      delete man.connected_users;
      delete man.connected_publishers;
      delete man.publishers_analytics;
    });

    return managers;
  }
}

module.exports = ManagersAnalyticsService;
