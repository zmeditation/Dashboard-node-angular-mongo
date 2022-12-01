const metrics = {
  requests(gfc, ct) {
    if (gfc) {
      return { $sum: '$ad_request' };
    }
    return { $sum: '$ad_request' };
  },
  impressions(gfc, ct) {
    if (gfc) {
      return { $sum: '$matched_request' };
    }
    return {
      $sum: {
        $cond: {
          if: { $eq: ['$commission.commission_type', 'Impressions'] },
          then: {
            $subtract: ['$matched_request', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$matched_request'] }]
          },
          else: '$matched_request'
        }
      }
    };
  },
  cpm(gfc, ct) {
    if (gfc) {
      return { $avg: '$ecpm' };
    }
    return {
      $avg: {
        $cond: {
          if: { $eq: ['$commission.commission_type', 'eCPM'] },
          then: { $subtract: ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$ecpm'] }] },
          else: '$ecpm'
        }
      }
    };
  },
  clicks(gfc, ct) {
    if (gfc) {
      return { $sum: '$clicks' };
    }
    return {
      $sum: {
        $cond: {
          if: { $eq: ['$commission.commission_type', 'eCPM'] },
          then: { $sum: '$clicks' },
          else: { $subtract: ['$clicks', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$clicks'] }] }
        }
      }
    };
  },
  ctr(gfc, ct) {
    if (gfc) {
      return { $avg: { $divide: [{ $multiply: ['$clicks', 100] }, { $cond: [{ $eq: ['$matched_request', 0] }, 1, '$matched_request'] }] } };
    }
    return {
      $avg: {
        $cond: {
          if: {
            $eq: ['$commission.commission_type', 'eCPM']
          },
          then: {
            $divide: [{ $multiply: ['$clicks', 100] }, { $cond: [{ $eq: ['$matched_request', 0] }, 1, '$matched_request'] }]
          },
          else: {
            $divide: [
              {
                $multiply: [{ $subtract: ['$clicks', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$clicks'] }] }, 100]
              },
              {
                $cond: [
                  { $eq: ['$matched_request', 0] },
                  1,
                  {
                    $subtract: ['$matched_request', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$matched_request'] }]
                  }
                ]
              }
            ]
          }
        }
      }
    };
  },
  revenue(gfc, ct) {
    if (gfc) {
      return { $sum: { $multiply: [{ $divide: ['$matched_request', 1000] }, '$ecpm'] } };
    }
    return {
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
                    $subtract: ['$matched_request', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$matched_request'] }]
                  },
                  1000
                ]
              },
              '$ecpm'
            ]
          }
        }
      }
    };
  },
  partnersFee(gfc, ct) {
    if (gfc) {
      return {
        $sum: {
          $divide: [
            { $multiply: [{ $subtract: ['$total_code_served_count', '$ad_exchange_impressions'] }, '$commission.commission_number'] },
            1000
          ]
        }
      };
    }
    return {
      $sum: {
        $cond: {
          if: { $gte: ['$invoiced_impressions', 0] },
          then: { $divide: [{ $multiply: ['$invoiced_impressions', '$commission.commission_number'] }, 1000] },
          else: {
            $divide: [
              { $multiply: [{ $subtract: ['$total_code_served_count', '$ad_exchange_impressions'] }, '$commission.commission_number'] },
              1000
            ]
          }
        }
      }
    };
  },
  fillRate(gfc, ct) {
    if (gfc) {
      return { $sum: { $multiply: [{ $divide: ['$matched_request', 1000] }, '$ecpm'] } };
    }
    return {
      $avg: {
        $cond: {
          if: { $eq: ['$commission.commission_type', 'eCPM'] },
          then: { $multiply: [{ $divide: ['$matched_request', { $cond: [{ $eq: ['$ad_request', 0] }, 1, '$ad_request'] }] }, 100] },
          else: {
            $multiply: [
              {
                $divide: [
                  {
                    $subtract: ['$matched_request', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, '$matched_request'] }]
                  },
                  {
                    $subtract: [
                      '$ad_request',
                      {
                        $multiply: [
                          { $divide: ['$commission.commission_number', 100] },
                          { $cond: [{ $eq: ['$ad_request', 0] }, 1, '$ad_request'] }
                        ]
                      }
                    ]
                  }
                ]
              },
              100
            ]
          }
        }
      }
    };
  }
};

exports.createMetricsObject = (query, gfc, commissionType) => {
  const metricsObject = {};

  for (const metric of query.metrics) {
    switch (metric) {
      case 'requests':
        metricsObject['requests'] = metrics[metric](gfc, commissionType);
        break;
      case 'impressions':
        metricsObject['impressions'] = metrics[metric](gfc, commissionType);
        break;
      case 'cpm':
        // if there is no Impression and Revenue included it has to be calculated either way implicitly
        if (!query.metrics.includes('revenue') || !query.metrics.includes('impressions')) {
          metricsObject['implicitImpressions'] = metrics['impressions'](gfc, commissionType);
          metricsObject['implicitRevenue'] = metrics['revenue'](gfc, commissionType);
        }
        metricsObject['cpm'] = metrics[metric](gfc, commissionType);
        break;
      case 'clicks':
        metricsObject['clicks'] = metrics[metric](gfc, commissionType);
        break;
      case 'ctr':
        // if there is no Impression and Click metric included it has to be calculated either way implicitly
        if (!query.metrics.includes('clicks') || !query.metrics.includes('impressions')) {
          metricsObject['implicitImpressions'] = metrics['impressions'](gfc, commissionType);
          metricsObject['implicitClicks'] = metrics['clicks'](gfc, commissionType);
        }
        metricsObject['ctr'] = metrics[metric](gfc, commissionType);
        break;
      case 'revenue':
        metricsObject['revenue'] = metrics[metric](gfc, commissionType);
        break;
      case 'partnersFee':
        metricsObject['partnersFee'] = metrics[metric](gfc, commissionType);
        break;
      case 'fillRate':
        if (!query.metrics.includes('requests') || !query.metrics.includes('impressions')) {
          metricsObject['implicitImpressions'] = metrics['impressions'](gfc, commissionType);
          metricsObject['implicitRequests'] = metrics['requests'](gfc, commissionType);
        }
        metricsObject['fillRate'] = metrics[metric](gfc, commissionType);
        break;
      default:
        break;
    }
  }

  // console.log(metricsObject);

  return metricsObject;
};
