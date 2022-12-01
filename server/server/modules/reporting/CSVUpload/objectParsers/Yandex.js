const time = require('date-and-time');
const request = require("request");
const { getInventory } = require('../../../../services/reporting/helperFunctions/getInventory');

exports.Yandex = (object) => {
    return createReportObject(object);
};

// !!!Загрузка по цсв для яндекса настроена без конвертации валюты!!!

function createReportObject(bodyObject) {

    async function getExchangeRate() {
        const previousExchangeRateURL = await getPreviousExchangeRateDate();
        const usdExchangeRate = await getCurrentUSDExchangeRate(previousExchangeRateURL);
        return usdExchangeRate;
    }
    const objectsToUpload = prepareObject(bodyObject);

    return objectsToUpload;
    function prepareObject(placement) {
        const inventory_sizes = getSize(placement['direct_block']);
        const inventory_type = getInventoryType(placement['direct_block']);

        return {
            property: {
                domain: getURL(placement['domain']),
                property_id: getAdUnit(placement['caption']),
                refs_to_user: null,
                am: null
            },
            inventory: getInventory({ inventory_sizes, inventory_type }),
            clicks: parseInt(placement['rtb_block_direct_clicks'], 10),
            ad_request: convertToInteger(placement['rtb_block_all_hits'], 10),
            matched_request: convertToInteger(placement['rtb_block_shows'], 10),
            day: parseDate(placement['date']),
            ecpm: parseECPM(placement['rtb_partner_wo_nds'], placement['rtb_block_shows']),
            report_origin: 'Yandex'
        };
      }

    function parseECPM(rev, imp, rate) {
        rev = parseFloat(rev.replace(',', '.'));
        imp = parseFloat(imp);
        // TIMEOUT не рабочая функция!!! Временное решение для получения курса доллара.
        // setTimeout( () => console.log(rate), 2000);

        // const revenueInUSD = (rev / rate);

        // if (revenueInUSD === 0) return 0;

        if (imp === 0) return 0;

        const ecpm = rev / imp * 1000;
        return parseFloat(ecpm.toFixed(2));
    }

    function getURL(url) {
        const url2 = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/\n]+)/im.exec(url);
        return url2[1];
    }

    function getAdUnit(string) {
        if (string !== undefined) {
            return string;
        }
    }

    function getInventoryType(inventory) {
        return inventory.search(/[0-9]/i) ? 'video' : 'banner';
    }

    function getSize(size) {
        return size.includes(',Fluid') ? 'Native' : size;
    }

    function parseDate(date) {

        const DateObject = date.includes('.') ? time.parse(date, 'D.M.YYYY', true) : time.parse(date, 'YYYY-MM-DD', true);
        const dateString = time.format(DateObject, 'YYYY-MM-DD');

        if (typeof dateString === 'string') {
            return dateString;
        }
    }
    function getCurrentUSDExchangeRate(url) {
        return new Promise((resolve, reject) => {
          request(url, (error, response) => {
            if (error) reject(error);
            const data = JSON.parse(response["body"]);
            resolve(data["Valute"]["USD"]["Value"]);
          });
        });
      }

    function getPreviousExchangeRateDate() {
        return new Promise((resolve, reject) => {
          const url = "https://www.cbr-xml-daily.ru/daily_json.js";
          request(url, (error, response) => {
            if (error) reject(error);
            const data = JSON.parse(response["body"]);
            resolve(data["PreviousURL"].replace("//", "https://"));
          });
        });
      }

    function convertToInteger(string, radix) {
        return string.includes(',') ? parseFloat(string.split(',').join('')) : parseFloat(string);
    }
}
