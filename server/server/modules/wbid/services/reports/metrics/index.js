const { dateFormate } = require('./date/index');
const { roundValues } = require('../../../../reporting/queryModule/queryRunner/runAggregationResultsHelpers/helpers');

class MetricsReform {
  constructor(args, filters) {
    this.args = args;
    this.filters = filters;
    if (this.args.length && typeof this.args !== 'string') {
      this.args.forEach(el => {
        el.metrics['gross_revenue'] = el.metrics['revenue'];
        el.metrics['bids_won'] = el.metrics['impressions'];
        delete el.metrics['impressions'];
        delete el.metrics['revenue'];
      })
    }
  }

  editPeriodForReq() {
    const finishDateObject = dateFormate(this.args);
    return finishDateObject;
  }

  roundInt(enumerate) {
    const result = this.args.map(el => {
      if (Object.keys(el.dimensions).includes('bidder')) {
        el.metrics['bidder_requests'] = el.metrics['requests'];
        el.metrics['bidder_fill_rate'] = el.metrics['fill_rate'];
        delete el.metrics['requests'];
        delete el.metrics['fill_rate'];
      }
      this.filters.forEach(filter => {
        if (filter.name === 'bidder' && !Object.keys(el.dimensions).includes('bidder')) {
          el.metrics['bidder_requests'] = el.metrics['requests'];
          el.metrics['bidder_fill_rate'] = el.metrics['fill_rate'];
          delete el.metrics['requests'];
          delete el.metrics['fill_rate'];
        }
      })
      el.metrics = roundValues(el.metrics);
      el.enumerate = enumerate;

      return el;
    })
    return result;
  }

  totalMetrics(total) {
    if (this.args.length > 0 && Object.keys(this.args[0].dimensions).includes('bidder')) {
      total['bidder_requests'] = total['requests'];
      total['bidder_fill_rate'] = total['fill_rate'];
      delete total['requests'];
      delete total['fill_rate'];
    }
    total['gross_revenue'] = total['revenue'];
    total['bids_won'] = total['impressions'];
    delete total['impressions'];
    delete total['revenue'];
    this.filters.forEach(filter => {
      if (filter.name === 'bidder' && this.args.length && !Object.keys(this.args[0]['dimensions']).includes('bidder')) {
        total['bidder_requests'] = total['requests'];
        total['bidder_fill_rate'] = total['fill_rate'];
        delete total['requests'];
        delete total['fill_rate'];
      }
    })
    return roundValues(total);
  }

  filterDataByRequstedMetrics (metrics, data, totalData) {
    const possibleMetrics = metrics.map(metric => {
      switch (metric) {
          case 'revenue': return 'gross_revenue';
          case 'impressions': return 'bids_won';
          default: return metric;
      }
    });
    if (possibleMetrics.includes('requests')) possibleMetrics.push('bidder_requests');
    if (possibleMetrics.includes('fill_rate')) possibleMetrics.push('bidder_fill_rate');
    if (Array.isArray(data) && data.length) {
      data.forEach(d => {
          for (let m of Object.keys(d.metrics)) {
              if (!possibleMetrics.includes(m)) {
                  delete d.metrics[m];
              }
          }
      })
    }
    const totalMetrics = this.totalMetrics(totalData);
    for (const t of Object.keys(totalMetrics)) {
        if (!possibleMetrics.includes(t)) {
            delete totalMetrics[t];
        }
    }
    return { filterResult: data, total: totalMetrics };
  }
}

module.exports = MetricsReform;
