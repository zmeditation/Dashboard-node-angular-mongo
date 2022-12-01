class FilterReformer {
  constructor(filters) {
    this.filters = filters
  }

  setNames() {
    try {
      const result = this.filters.map(el => {
        el.data = el.values.map(e => typeof e === 'string' ? e.toLowerCase() : e);
        delete el.values;
        delete el.filterId;
        el.type = el.type.includes('inc') ? 'inc' : 'exc';
        const { name } = el;
        switch(name) {
          case 'COUNTRIES':
            el.name = 'country';
            break;
          case 'BIDDERS':
            el.name = 'bidder';
            break;
          case 'AD_UNITS':
            el.name = 'ad_unit_code';
            break;
          case 'PUBLISHERS':
            el.name = 'publisher_id';
            break;
          case 'SIZES':
            el.name = 'ad_unit_size';
            break;
          case 'INVENTORY_TYPES':
            el.name = 'ad_unit_type';
            break;
          case 'SITES':
            el.name = 'site';
            el.data = this.parseSite(el.data);
            break;
          case 'DEVICES':
            el.name = 'device';
            break;
          case 'MANAGERS':
            el.name = 'manager_id';
            break;
          case 'OS':
            el.name = 'os';
            break;
          case 'BROWSERS':
            el.name = 'browser';
            break;
          default:
            break;
        }
        return el;
      })
      return result;
    } catch(err) {
      throw err;
    }
  }

  parseSite(siteArr) {
    if (siteArr !== '') {
      const result = siteArr.map(site => {
        const domain = site.replace(/^(https:\/\/(w{3}\.|)|http:\/\/(w{3}\.|))/gi, '');
        return domain.replace(/\//g, '');
      })
      return result;
    }
    return siteArr;
  }

}

module.exports = FilterReformer;
