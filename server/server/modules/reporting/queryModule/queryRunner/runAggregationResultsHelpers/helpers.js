exports.roundValues = (resultObject) => {
    const metricSettings = {
        toFixed: {
            ctr: 2,
            revenue: 2,
            fillrate: 2,
            cpm: 2,
            requests: 0,
            impressions: 0,
            clicks: 0,
            partnersfee: 2,
            fill_rate: 2,
            bidder_requests: 0,
            bidder_fill_rate: 2,
            dsp_imp_fill_rate: 2,
            dsp_win_fill_rate: 2,
            dsp_fill_rate: 2,
            ssp_imp_fill_rate: 2,
            ssp_fill_rate: 2,
            revenue_imp: 2,
            cpm_imp: 2,
            cpm_win: 2,
            cpm_all: 2,
            viewability: 1
        }
    };

    for (const metric of Object.keys(resultObject)) {
        if (resultObject[metric] === '---') {
            continue;
        }
        resultObject[metric] = +resultObject[metric];
        resultObject[metric] = parseFloat(resultObject[metric].toFixed(metricSettings['toFixed'][metric]));
        resultObject[metric] = isNaN(resultObject[metric]) ? 0 : resultObject[metric];
    }
    return resultObject;
};
