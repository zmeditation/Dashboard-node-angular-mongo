const fs = require('fs');
const mongoose = require('mongoose');
const Properties = require('../../database/mongoDB/migrations/propertyModel/index');

class HeaderBiddingService {
    constructor() {
        const data = fs.readFileSync(`${__dirname}/config/hb_ad_units.txt`, "utf8");

        this.adUnits = JSON.parse(data);
    }

    isMutka(placement, origin) {
        const properties = {
            'Ok.ru_all_rolls': 'Google Ad Manager',
            'Mail.ru_media_projects': 'Google Ad Manager'
        };
        return properties[placement] === origin;
    }

    getDomain(domain, placement) {
        if (!placement) return domain;

        const mixedUpAdUnits = {
            '200x200_mail.ru_hb_2': 'ok.ru',
            '200x200_mail.ru_hb_1': 'ok.ru',
            'e_mail_ru_300x250_HB_2': 'e.mail.ru',
            '160x600_mail.ru': 'e.mail.ru',
            'e_mail_ru_160x600_HB_1': 'e.mail.ru',
            '/112081842/e_mail_ru_160x600_HB_1': 'e.mail.ru',
            '160x600_e.mail.ru': 'e.mail.ru',
            'news18_AMAZON_728x90': 'news18.com',
            'news18_AMAZON_300x250': 'news18.com',
            'news18_AMAZON_300x600': 'news18.com',
            'news18_AMAZON_320x50': 'news18.com'
        };

        if ((placement.indexOf('ok.ru') !== -1 && placement.indexOf('ok.ru') <= 4) || placement.toLowerCase().includes('ok_ru')) {
            return 'ok.ru'
        }

        if (mixedUpAdUnits[placement]) {
            return mixedUpAdUnits[placement]
        }

        const domains = {
            'ad.mail.ru': (placement.indexOf('ok.ru') !== -1 && placement.indexOf('ok.ru') <= 4) || placement.includes('ok_ru') ? 'ok.ru' : 'mail.ru',
            'news.mail.ru': 'mail.ru',
            'my.mail.ru':'mail.ru',
            'sport.mail.ru': 'mail.ru',
            'hi-tech.mail.ru': 'mail.ru',
            'lady.mail.ru': 'mail.ru',
            'auto.mail.ru': 'mail.ru',
            'deti.mail.ru': 'mail.ru',
            'pogoda.mail.ru': 'mail.ru',
            'kino.mail.ru': 'mail.ru',
            'afisha.mail.ru': 'mail.ru',
            'health.mail.ru': 'mail.ru',
            'otvet.mail.ru': 'mail.ru',
            'games.mail.ru': 'mail.ru',
        };

        return domains[domain] ? domains[domain] : domain;
    }

    getRandomRequestByRandomFillRate(impressions, fillRate) {
        let randomFillRate = getRandomFillRate(fillRate);

        return (impressions * 100 / randomFillRate).toFixed(0);

        function getRandomFillRate(number = 25) {
            const fillRate = Math.floor(Math.random() * 5) + number;
            return fillRate;
        }
    }

    changePlacementNameIfNoRequests(reports) {
        for (const report of reports) {
            if (report['metrics']['requests'] === 0 && report['metrics']['impressions'] && report['dimensions']['placement']) {
                report['dimensions']['placement'] = 'Other';
            }
        }

        return reports;
    }

    getMatches(property) {
        const matches = [];

        for (const adUnit of this.adUnits.adUnits) {
            // if (properties.includes(adUnit)) {
            //     matches.push(adUnit);
            // }
            if (property === adUnit) {
                matches.push(adUnit);
            }
        }

        return matches;
    }

    async getAllHBConfigs() {
        console.log('Get list of HB configs')
        return await Properties.find({
            property_origin: 'Google Ad Manager HB',
            refs_to_user: { $ne: null }
        }).distinct('refs_to_user').then(async r => {
            const ids = r.map(id => id.toString());
            const plcmnt = await Properties.find({
                refs_to_user: { $in: ids },
                property_origin: 'Google Ad Manager HB'
            }).distinct('placement_name');
            return {
                ids,
                plcmnt
            };
        });
    }
}

module.exports = HeaderBiddingService;
