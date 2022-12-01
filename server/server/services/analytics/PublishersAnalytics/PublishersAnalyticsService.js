const mongoose = require('mongoose');
const User = mongoose.model('User');
const { handleErrors } = require('../../helperFunctions/handleErrors');
const MainAnalyticsService = require('../MainAnalyticsService');

class PublishersAnalyticsService extends MainAnalyticsService {
  constructor() {
    super();
  }

  async getPublishersAnalytics(params) {
    try {
      const {
        pathToFile,
        datesRange = this.datesRangeDefault,
        interval = 'daily',
        writeInFile = true,
        createAtPubsRange = this.createAtRangeDefault
      } = params;
      if (!datesRange.from) {
        throw `datesRange.from is ${datesRange.from}`;
      }
      if (!datesRange.to) {
        throw `datesRange.to is ${datesRange.to}`;
      }

      const publishers = await this.getAllPublishers({ createAtPubsRange });
      if (!publishers) return { analytics: [] };

      const publishersId = this.filterPublishersIdByCommissionsType(publishers);
      const pubsRepotrsRev = await this.getPublishersReportsRevenue({ datesRange, publishersId });

      const dateIntervalsArr = this.getDateIntervals({ datesRange, interval });
      const correctPubsObj = this.changePubsObj(publishers);
      const updatedPubs = await this.setPubsAnalytics({ publishers: correctPubsObj, pubsRepotrsRev, dateIntervalsArr });

      const lastUpdate = new Date().getTime();
      const analyticsObj = {
        success: true,
        msg: 'SUCCESSFUL_REQUEST',
        analytics: updatedPubs,
        last_update: lastUpdate
      };

      await this.writeAnalytics({ writeInFile, analyticsObj, pathToFile });

      return analyticsObj;
    } catch (error) {
      const customText = 'Error in getPublishersAnalytics';
      throw handleErrors(error, customText).error;
    }
  }

  async getAllPublishers(params) {
    const {
      createAtPubsRange: { from, to }
    } = params;

    return await User.find(
      {
        role: { $eq: 'PUBLISHER' },
        $or: [{ am: { $type: 'objectId' } }, { sam: { $type: 'objectId' } }],
        createdAt: { $gte: from, $lte: to },
        'enabled.status': true
      },
      '_id name photo commission createdAt'
    ).lean();
  }

  changePubsObj(publishers) {
    return publishers.map((pub) => {
      return {
        _id: pub._id,
        name: pub.name,
        created_at: pub.createdAt
      };
    });
  }

  async setPubsAnalytics(params) {
    const { publishers, pubsRepotrsRev, dateIntervalsArr } = params;
    const firstIndex = 0;
    const lastIndex = publishers.length - 1;

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
              publishers[this.current].analytics = await this.setAndSortFunc({
                publisher: publishers[this.current],
                pubsRepotrsRev,
                dateIntervalsArr
              });
              this.current++;
              return { done: false, value: publishers[this.current - 1] };
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

    return publishers;
  }

  async setAndSortAnalytics(params) {
    const { publisher, pubsRepotrsRev, dateIntervalsArr } = params;
    const analytics = [];

    pubsRepotrsRev.forEach((report) => {
      if (publisher._id.toString() === report._id.user_id.toString()) {
        analytics.push({ date: report.date, revenue: report.revenue.toFixed(2) });
      }
    });

    const analyticsDates = analytics.map((obj) => obj.date);
    dateIntervalsArr.forEach((date) => {
      if (!analyticsDates.includes(date)) {
        analytics.push({ date, revenue: '0.00' });
      }
    });

    return analytics.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
}

module.exports = PublishersAnalyticsService;
