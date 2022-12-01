class FilterReformer {
    constructor(filters) {
        this.filters = filters
    }

    setNames() {
        try {
            return this.filters.map(el => {
                el.data = el.values;
                delete el.values;
                delete el.filterId;
                el.type = el.type.includes('inc') ? 'inc' : 'exc';
                const {name} = el;
                switch (name) {
                    case 'COUNTRIES':
                        el.name = 'country';
                        break;
                    case 'DSP':
                        el.name = 'dsp_name';
                        break;
                    case 'SOURCES':
                        el.name = 'source_type';
                        break;
                    case 'AD_UNITS':
                        el.name = 'ad_unit';
                        break;
                    case 'PUBLISHERS':
                        el.name = 'pub_id';
                        break;
                    case 'SSP':
                        el.name = 'ssp_pub_id';
                        break;
                    case 'SIZES':
                        el.name = 'size';
                        break;
                    case 'IMPRESSION_TYPES':
                        el.name = 'imp_type';
                        break;
                    case 'CURRENCIES':
                        el.name = 'cur';
                        break;
                    case 'DOMAINS':
                        el.name = 'domain';
                        el.data = this.parseSite(el.data);
                        break;
                    case 'DEVICES':
                        el.name = 'device_type';
                        break;
                    case 'OS':
                        el.name = 'os';
                        break;
                }
                return el;
            });
        } catch (err) {
            throw err;
        }
    }

    parseSite(siteArr) {
        if (siteArr !== '') {
            return siteArr.map(site => {
                const domain = site.replace(/^(https:\/\/(w{3}\.|)|http:\/\/(w{3}\.|))/gi, '');
                return domain.replace(/\//g, '');
            });
        }
        return siteArr;
    }

}

module.exports = FilterReformer;
