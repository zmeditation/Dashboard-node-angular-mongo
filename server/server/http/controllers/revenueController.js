const { ERROR_CODES } = require('../../constants/errors');
const { RevenueModel } = require('../../database/mongoDB/migrations/RevenueModel');
const { invoicesInformerService } = require('../../services/invoices/index');
const revenueUpdate = require('../../../../server/server/services/invoices/cronJobForRevenues');
const moment = require('moment');

module.exports = {
  // save revenue in db
  create: async (request, response) => {
    const { publisher, revenue, revenue_rtb, deduction, begin, end } = request.body;
    const check = await RevenueModel.find({ publisher, begin, end });
    if (check && check.length) {
      return response.status(ERROR_CODES.ALREADY_REPORTED).send({ success: false, result: 'ALREADY_EXISTS' });
    } else {
      const Revenue = new RevenueModel({
        publisher, revenue, revenue_rtb, deduction, begin, end
      });
      await Revenue.populate({ path: 'publisher', select: '_id name' }).execPopulate();
      await Revenue.save();
      await invoicesInformerService([`${ publisher }`], {
        event: 'revenue',
        action: 'upload',
        success: true
      });
      response.send({ success: true, result: 'REVENUE_SAVED' });
    }
  },
  // get all revenues
  get: async (request, response) => {
    const revenues = await RevenueModel.aggregate([
      {
        $lookup: {
          localField: 'publisher',
          foreignField: '_id',
          from: 'users',
          as: 'publisher',
        }
      },
      {
        $match: { 'publisher.enabled.status': true }
      },
      {
        $unwind: {
            path: '$publisher',
            preserveNullAndEmptyArrays: true
        }
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              '$$ROOT', {
                publisher: {
                  _id: '$publisher._id',
                  name: '$publisher.name',
                },
              }
            ]
          }
        }
      }
    ]);

    console.log('Total revenues saved in DB:', revenues.length);
    response.send({ success: true, result: revenues });
  },

  // get revenues by publisher and period
  find: async (request, response) => {
    const { publisher, begin, end } = request.query;
    let query = {};
    if (begin && end) {
      query.begin = begin;
      query.end = end;
    }
    if (publisher) {
      query.publisher = publisher;
    }
    const revenues = await RevenueModel.find(query).populate({ path: 'publisher', select: '_id name' }).lean();
    revenues && revenues.length
      ? response.send({ success: true, result: revenues })
      : response.status(ERROR_CODES.NO_CONTENT).send({ success: false, result: 'NOT_FOUND' });
  },

  //update revenue values
  update: async (request, response) => {
    const { publisher, begin, end, additional, ...updateQuery } = request.body;
    if (!publisher || !begin || !end) {
      return response.status(ERROR_CODES.BAD_REQUEST).send({ success: false, result: 'REQUIRED_PARAMS_MISSED' });
    }
    const R = await RevenueModel.findOneAndUpdate({ publisher, begin, end }, updateQuery);
    if (!R) {
      return response.send({ success: false, result: 'REVENUE_NOT_FOUND' });
    }
    response.send({ success: true, result: 'REVENUE_UPDATED' });
  },

  //delete revenues for selected publisher or for selected date
  remove: async (request, response) => {
    const { publisher, begin, end, mode } = request.query;
    if (!mode || (mode !== 'byDate' && mode !== 'byPublisher')) {
      return response.status(ERROR_CODES.BAD_REQUEST)
        .send({ success: false, result: 'INCORRECT_REQUEST' });
    }
    if ((mode === 'byDate' && !begin) || (mode === 'byPublisher' && !publisher)) {
      return response.status(ERROR_CODES.BAD_REQUEST)
        .send({ success: false, result: 'REQUIRED_PARAMS_MISSED' });
    }
    const query = {};
    if (mode === 'byPublisher') {
      query.publisher = publisher;
    }
    if (begin && end) {
      query.begin = begin;
      query.end = end;
    }
    const revenues = await RevenueModel.deleteMany(query);
    response.send(revenues.deletedCount && revenues.deletedCount > 0
      ? { success: true, result: 'REVENUES_DELETED' }
      : { success: false, result: 'NO_REVENUES_FOUND' });
  },

  rewrite: async (request, response) => {
    const { date } = request.body;
    const begin = moment(date).startOf('month').format('YYYY-MM-DD');
    const end = moment(date).endOf('month').format('YYYY-MM-DD');
    const query = { begin, end };
    console.log('Start to delete old revenue values');
    const deleted = await RevenueModel.deleteMany(query);
    console.log('All old revenues deleted, total count:', deleted.deletedCount);
    console.log(`Start updating all revenues from ${ begin } to ${ end }`);
    await revenueUpdate(date);
    console.log('All revenues updated!');
    response.send({ success: true, result: 'REVENUES_UPDATED' });
  }
}
