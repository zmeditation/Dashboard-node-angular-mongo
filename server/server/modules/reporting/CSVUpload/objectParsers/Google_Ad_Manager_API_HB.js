const time = require('date-and-time');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');

exports.Google_Ad_Manager_API_HB = (object) => {
    return createReportObject(object);
};

function createReportObject(bodyObject) {

    bodyObject = {...bodyObject.Dimension, ...bodyObject.Column };

    if (!bodyObject['AD_EXCHANGE_DFP_AD_UNIT'] || bodyObject['AD_EXCHANGE_DFP_AD_UNIT'] === 'Total') {
        return 'missing data';
    }

    if (!bodyObject['AD_EXCHANGE_SITE_NAME']) {
        console.log(bodyObject, 'AD_EXCHANGE_SITE_NAME');
    }

    const inventory_sizes = getSize(bodyObject['AD_EXCHANGE_INVENTORY_SIZE']);
    const inventory_type = getInventoryType(bodyObject['AD_EXCHANGE_INVENTORY_SIZE']);

    const object = {
        property: {
            domain:  getURL(bodyObject['AD_EXCHANGE_SITE_NAME']),
            property_id: getAdUnit(bodyObject['AD_EXCHANGE_DFP_AD_UNIT']) || getReportName(bodyObject['AD_EXCHANGE_SITE_NAME']),
            refs_to_user: null,
            am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        clicks: 0,
        ad_request: bodyObject['AD_EXCHANGE_AD_REQUESTS'],
        matched_request: 0,
        day: parseDate(bodyObject['AD_EXCHANGE_DATE']),
        ecpm: 0,
        report_origin: 'Google Ad Manager HB'
    };

    if (object['property']['domain'].includes('(unknown)')) {
        return 'missing data';
    } else {
        return object;
    }

    function getSize(size) {
        // return size;
        return size.includes(',Fluid') ? 'Native' : size;
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

    function parseDate(date) {

        const DateObject = date.includes('/') ? time.parse(date, 'M/D/YY', true) : time.parse(date, 'YYYY-MM-DD', true);
        const dateString = time.format(DateObject, 'YYYY-MM-DD');

        if (typeof dateString === 'string') {
            return dateString;
        }
    }
}
