const mongoose = require('mongoose');
const ReportModel = mongoose.model('Reports');
const User = mongoose.model('User');
const { generateAggregationObject } = require('../queryBuilder/index');
const { combineAggregationResults } = require('./runAggregationResultsHelpers/combineAggregationResults');
const { beautifyAggregationResults } = require('./runAggregationResultsHelpers/beautifyAggregationResults');
const { getTotalOfAggregationResults } = require('./runAggregationResultsHelpers/getTotalFromAggregationResults');
const HeaderBiddingService = require('./../../../../services/reporting/HeaderBiddingService');
// const GoogleCommission = require('../../partnersCommission/google/googleWMG');
const v8 = require('v8');
const FileExport = require('../../FileExport/index');

exports.runAggregationQuery = async (queryObjects, gfc = false, userTokenId) => {
  try {
    if (queryObjects.length === 0) {
      return [];
    }

    const headerBiddingService = new HeaderBiddingService();
    const aggregationPromises = [];
    const aggregationViewAbilityPromises = [];
    const queryCommissionArray = [];
    const publishers = queryObjects.reduce((acc, query) => [...acc, ...query['publishers']], []);
    const managers = queryObjects.reduce((acc, query) => [...acc, ...query['managers']], []);
    const [
      {
        query: { interval, metrics, dimensions, fillMissing, enableExport, enumerate }
      }
    ] = queryObjects;

    const placeholderSettings = {
      interval,
      metrics,
      fillMissing,
      placeholderArray: []
    };

    for (const queryObject of queryObjects) {
      const { query, commissionType } = queryObject;

      const { query: result, dummyArray } = generateAggregationObject(query, gfc, commissionType);

      placeholderSettings.placeholderArray = dummyArray;

/*      if (Object.keys(result[2].$group).includes('partnersFee')) {
        queryCommissionArray.push(agCommissionPartners(result));
        delete result[2].$group.partnersFee;
      }*/
      if (metrics.includes('viewability')) {
        const viewAbility = createAggregateViewability(result);
        aggregationViewAbilityPromises.push(ReportModel.aggregate(viewAbility).exec());
      }

      aggregationPromises.push(ReportModel.aggregate(result).exec());
    }
    const commissionResult = await Promise.all(queryCommissionArray);
    const reports = await Promise.all(aggregationPromises);
    const viewabilityReports = await Promise.all(aggregationViewAbilityPromises);
    const changedReports = metrics.includes('viewability') ? attachViewability(viewabilityReports, reports) : reports;
    const combinedResults = combineAggregationResults(changedReports, placeholderSettings, commissionResult);
    // added headerBiddingOptimization
    const finalResults = headerBiddingService.changePlacementNameIfNoRequests(
      beautifyAggregationResults(combinedResults, publishers, managers)
    );

    const totalResults = getTotalOfAggregationResults(finalResults, metrics);

    // to refactor this
    const lcDimensions = dimensions.map((dimension) => dimension);
    const allowedDimensions = ['publisher', 'placement', 'property', 'domain', 'origin', 'inventorytype', 'size', 'manager'];

    for (const resultObject of finalResults) {
      resultObject.enumerate = enumerate;

      for (const dimension of lcDimensions) {
        if (!resultObject.dimensions[dimension] && resultObject.dimensions[dimension] !== 0) {
          resultObject.dimensions[dimension] = '    -    ';
        }
      }

      const tempDimensions = {};
      for (const dimension of allowedDimensions) {
        if (resultObject['dimensions'][dimension]) {
          tempDimensions[dimension] = resultObject.dimensions[dimension];
        }
      }
      resultObject['dimensions'] = tempDimensions;
      delete resultObject['implicit'];
    }

    if (enableExport) {
      const { permissions } = await User.findOne({ _id: userTokenId });
      if (permissions.includes('hideRequestsAndFillrate')) {
        finalResults.forEach((el) => {
          delete el.metrics.requests;
          delete el.metrics.fillrate;
        });
        delete totalResults.fillrate;
        delete totalResults.requests;
      }
      const fileExport = new FileExport(userTokenId);
      fileExport.create(finalResults, totalResults);
    }

    finalResults.sort();
    return {
      results: finalResults,
      total: totalResults
    };
  } catch (e) {
    console.error(e);
  }
};

/*function agCommissionPartners(query) {
  const queryForCommission = [
    {
      $match: {
        'property.domain': query[0].$match['property.domain'],
        'property.property_id': query[0].$match['property.property_id'],
        'property.am': query[0].$match['property.am'],
        day: query[0].$match['day']
      }
    },
    {
      $sort: query[1].$sort
    },
    {
      $group: {
        _id: query[2].$group._id,
        partnersFee: query[2].$group.partnersFee,
        date: query[2].$group.date,
        interval: query[2].$group.interval
      }
    }
  ];
  return new GoogleCommission().countingCommission(queryForCommission);
}*/

const createAggregateViewability = (query) => {
  try {
    const viewabilityQuery = v8.deserialize(v8.serialize(query));

    return viewabilityQuery.map((queryObj) => {
      if (queryObj?.['$match']) {
        queryObj['$match'].ad_request = { $gt: 0 };
        queryObj['$match'].matched_request = { $gt: 0 };
        return queryObj;
      }

      if (queryObj['$group']) {
        if (queryObj['$group'].requests) {
          queryObj['$group'] = {
            _id: queryObj['$group']._id,
            requests: queryObj['$group'].requests,
            viewability: { $push: '$viewability' },
            date: queryObj['$group'].date
          };
          return queryObj;
        } else if ((queryObj['$group'].impressions)) {
          queryObj['$group'] = {
            _id: queryObj['$group']._id,
            impressions: queryObj['$group'].impressions,
            viewability: { $push: '$viewability' },
            date: queryObj['$group'].date
          };
          return queryObj;
        }else {
          queryObj['$group'] = {
            _id: queryObj['$group']._id,
            viewability: { $push: '$viewability' },
            date: queryObj['$group'].date
          };
          return queryObj;
        }
      }
      return queryObj;
    });
  } catch (error) {
    console.log(error);
    return query;
  }
};

const attachViewability = (viewabilityReports, reports) => {
  const viewabilityObjects = reduceViewability(viewabilityReports);
  return attachViewabilityToReports(viewabilityObjects, reports);
};

const reduceViewability = (results) => {
  return results.map((array) => {
    return array.map((obj) => {
      if (!Array.isArray(obj.viewability) || !obj.viewability.length) {
        obj.viewability = '---';
        return obj;
      }

      obj.viewability = obj.viewability
        .filter((num) => {
          return 100 > num && num > 0;
        })
        .reduce((accVal, curVal, index, array) => {
          if (index === array.length - 1) {
            return (accVal + curVal) / array.length;
          }
          return accVal + curVal;
        }, 0);

      return obj;
    });
  });
};

const attachViewabilityToReports = (viewabilityObjects, reports) => {
  return reports.map((reportsArray, reportIndex) => {
    return reportsArray.map((report) => {
      viewabilityObjects[reportIndex].forEach((viewability) => {
        if (JSON.stringify(viewability._id) === JSON.stringify(report._id)) {
          report.viewability = viewability.viewability;
        }
      });

      if (!report.viewability) {
        report.viewability = '---';
        return report;
      }

      return report;
    });
  });
};
