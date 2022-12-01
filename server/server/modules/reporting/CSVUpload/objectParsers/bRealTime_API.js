const time = require('date-and-time');
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');

exports.bRealTime_API = (object) => {
    return createReportObject(object);
};

function createReportObject(bodyObject) {
    if (!bodyObject['placement'] || bodyObject['mediatype'] === 'Unknown' || bodyObject['placement'] === '160x600_ok.ru Display $.50 CPM (12279311)') {
        return 'missing data';
    }

    const inventory_sizes = getInventorySize(bodyObject['size']);
    const inventory_type = getInventoryType(bodyObject['mediatype']);

    return {
        property: {
            domain: getDomain(bodyObject['placement']),
            property_id: getPlacementName(bodyObject['placement']),
            refs_to_user: null,
            am: null
        },
        inventory: getInventory({ inventory_sizes, inventory_type }),
        clicks: parseInt(bodyObject['clicks'], 10),
        ad_request: convertToInteger(bodyObject['imp_requests'], 10),
        matched_request: convertToInteger(bodyObject['imps_total'], 10),
        day: parseDate(bodyObject['day']),
        ecpm: parseECPM(bodyObject['publisher_rpm']),
        report_origin: 'bRealTime'
    };

    function parseECPM(ecpm) {
        ecpm = typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm);
        return parseFloat(ecpm.toFixed(2));
    }

    function getDomain(siteName) {
        if (siteName.includes('rbc.ru_300x250')) {
            return 'rbc.ru';
        } else if (siteName.includes('mail.ru_300x250_standard Display')) {
            return 'mail.ru';
        }
        const domain = /\- *(.*?)\_/gi.exec(siteName)[1];

        if (domain) {
            return getURL(domain);
        } else {
            return 'invalid.domain'
        }
    }

    function getURL(url) {
        const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
        return url2[1];
    }

    function getPlacementName(placement) {
        return placement.replace(/\s+/g, " ").trim().split(' (')[0];
    }

    function getInventorySize(inventory) {
        const sizes = ['88x31', '120x20', '120x30', '120x60', '120x90', '120x240', '120x600', '125x125', '160x600', '168x28',
            '168x42', '180x150', '200x200', '200x446', '216x36', '216x54', '220x90', '234x60', '240x133', '240x400', '250x250',
            '250x350', '250x360', '250x400', '292x30', '300x31', '300x50', '300x75', '300x100', '300x250', '300x450', '300x600',
            '300x1050', '320x50', '320x100', '320x480', '336x280', '468x60', '480x320', '580x250', '580x400', '728x90', '750x100',
            '750x200', '750x300', '768x1024', '930x180', '950x90', '960x90', '970x66', '970x90', '970x250', '980x90', '980x120',
            '1024x768', '1060x90', '970x200', '640x480', '640x400', '580x450', '512x288', '430x288', '300x300', '1x1', '1x0',
            '2x0', '3x0', '4x0', 'Video/Overlay', 'custom'];

        if (inventory.indexOf('_') >= 0) {
            const tempInventory = inventory.split('_')[0];
            return  sizes.includes(tempInventory) ? tempInventory : 'custom';
        } else {
            return  sizes.includes(inventory) ? inventory : 'custom';
        }
    }

    function getInventoryType(inventory) {
        const allowed = ['banner', 'video'];
        return allowed.includes(inventory.toLowerCase()) ? 'banner' : 'video';
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
