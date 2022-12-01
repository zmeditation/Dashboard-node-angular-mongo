const { canReadAllReports } = require('../reporting/RunCustomReport/runCustomReportSmaller.js');
const { canReadAllDeductions } = require('../deduction/GetPubsDeductions/getDeductionSmall');
//to add rtb reports later
const { getPublishersFilter } = require('../users/GetPublishers/getPublishersSmaller');
const moment = require('moment');
const sumBy = require('lodash/sumBy');
const { RevenueModel } = require('../../database/mongoDB/migrations/RevenueModel');

const revenueUpdate = async (date) => {
  const initDate = date ? new Date(date) : new Date();
  let begin, end;
  if (date) {
    begin = moment(initDate.toISOString())
      .startOf('month')
      .format('YYYY-MM-DD');
    end = moment(initDate.toISOString())
      .endOf('month')
      .format('YYYY-MM-DD');
  } else {
    begin = moment(initDate.toISOString())
      .subtract(1, 'months')
      .startOf('month')
      .format('YYYY-MM-DD');
    end = moment(initDate.toISOString())
      .subtract(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
  }
  const pubsQuery = {
    findBy: ['ALL'],
    options: '_id name role'
  };
  const mainRevenueQuery = {
    type: 'main',
    range: 'custom',
    interval: 'total',
    enumerate: false,
    fillMissing: false,
    enableExport: false,
    customRange: { dateFrom: begin, dateTo: end },
    metrics: ['revenue'],
    filters: [],
    dimensions: ['publisher']
  };

  const deductionsQuery = {
    publishersId: [],
    managersId: [],
    range: 'custom',
    customRange: { dateFrom: begin, dateTo: end }
  }

  let publishers = await getPublishersFilter(pubsQuery);
  publishers = publishers.filter(pub => pub.role === 'PUBLISHER');
  const mainReports = await canReadAllReports(mainRevenueQuery);
  const deductions = await canReadAllDeductions(deductionsQuery);

  const revenues = [];

  for (const report of mainReports.results) {
    let currentPub = publishers.filter(pub => {
      return pub.name.toLowerCase() === report.dimensions.publisher.toLowerCase();
    });
    let currentDeduction;
    if (currentPub.length && deductions.length) {
      for (const deduction of deductions) {
        if (deduction.refs_to_user.name.toLowerCase() === currentPub[0].name.toLowerCase()) {
          currentDeduction = sumBy(deduction?.deductions, 'deduction');
        }
      }
    }
    revenues.push({
      publisher: currentPub[0]._id,
      name: currentPub[0].name,
      begin,
      end,
      revenue: report.metrics.revenue,
      revenue_rtb: 0,
      deduction: currentDeduction ? currentDeduction : 0
    })
  }
  await RevenueModel.insertMany(revenues);
}

module.exports = revenueUpdate;
