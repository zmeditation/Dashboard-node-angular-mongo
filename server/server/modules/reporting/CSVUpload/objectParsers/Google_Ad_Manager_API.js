const time = require('date-and-time');
const GoogleCommission = require('../../partnersCommission/google/googleWMG');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');

exports.Google_Ad_Manager_API = (object, queryId) => {
    if (queryId === '11452463613') {
        const FeeForGoogle = new GoogleCommission();
        const report = FeeForGoogle.parsePartnerCommission(object);
        return report;
    } else {
        return createReportObject(object, queryId);
    }
};


function createReportObject(bodyObject, queryId) {

    bodyObject = {...bodyObject.Dimension, ...bodyObject.Column };

    if (!bodyObject['AD_EXCHANGE_DFP_AD_UNIT'] || bodyObject['AD_EXCHANGE_DFP_AD_UNIT'] === 'Total') {
        return 'missing data';
    }

    if (!bodyObject['AD_EXCHANGE_SITE_NAME']) {
        console.log(bodyObject, 'Sites');
    }

    const inventory_sizes = getSize(bodyObject['AD_EXCHANGE_INVENTORY_SIZE']);
    const inventory_type = getInventoryType(bodyObject['AD_EXCHANGE_INVENTORY_SIZE']);

    return {
        property: {
            domain:  getURL(bodyObject['AD_EXCHANGE_SITE_NAME']),
            property_id: getAdUnit(bodyObject['AD_EXCHANGE_DFP_AD_UNIT']) || getReportName(bodyObject['AD_EXCHANGE_SITE_NAME']),
            refs_to_user: null,
            am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        clicks: parseInt(bodyObject['AD_EXCHANGE_CLICKS'], 10),
        ad_request: convertToInteger(bodyObject['AD_EXCHANGE_AD_REQUESTS'], 10),
        matched_request: convertToInteger(bodyObject['AD_EXCHANGE_IMPRESSIONS'], 10),
        day: parseDate(bodyObject['AD_EXCHANGE_DATE']),
        ecpm: parseECPM(bodyObject['AD_EXCHANGE_AD_ECPM']),
        report_origin: 'Google Ad Manager'
    };

    function parseECPM(ecpm) {
        ecpm = typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) / 1000000 : parseFloat(ecpm) / 1000000;
        return parseFloat(ecpm.toFixed(2));
    }

    function getReportName(siteName) {
        let replBegin = siteName.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
        let splitSpace = replBegin.split(/\s/g);
        return splitSpace[0].toLowerCase();
    }

    function getURL(url) {
        const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
        return url2[1];
    }

    function getAdUnit(string) {
        if (string !== undefined) {
            return string.substr(string.lastIndexOf("»") + 2);
        }
    }

    function getInventoryType(inventory) {
        return inventory.search(/[0-9]/i) ? 'video' : 'banner';
    }

    function getSize(size) {
        return size.includes(',Fluid') ? 'Native' : size;
    }

    function parseDate(date) {

        const DateObject = date.includes('/') ? time.parse(date, 'M/D/YY', true) : time.parse(date, 'YYYY-MM-DD', true);
        const dateString = time.format(DateObject, 'YYYY-MM-DD');

        if (typeof dateString === 'string') {
            return dateString;
        }
    }

    function convertToInteger(string, radix) {
        return string.includes(',') ? parseFloat(string.split(',').join('')) : parseFloat(string);
    }
}
