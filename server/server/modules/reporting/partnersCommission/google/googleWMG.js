const mongoose = require('mongoose');
const CommissionReports = mongoose.model('Commission_Reports');

class GoogleCommission {

  constructor() {}

  parsePartnerCommission(object, commission_number = 0.0075) {
      try {
        const { Dimension, Column } = object;
        const report = this.createCommissionObject(Dimension, Column, commission_number);
        if (!Dimension['AD_UNIT_NAME'] || Dimension['AD_UNIT_NAME'] === 'Total') {
          return 'missing data';
        }
        return report;
      } catch(err) {
        throw err;
      }
  }

  createCommissionObject(
    { AD_UNIT_NAME: AdUnit, DATE: date },
    { AD_EXCHANGE_LINE_ITEM_LEVEL_IMPRESSIONS: imps, TOTAL_CODE_SERVED_COUNT: reqs, INVOICED_IMPRESSIONS: invImp },
    commission_number
  ) {
    const parseAdUnitName = this.getAdUnit(AdUnit);

    const parseDomainFromUnit = this.getDomain(parseAdUnitName);
    const object = {
      commission: {
        commission_number,
        commission_type: 'Unsold Requests'
      },
      property: {
        property_id: parseAdUnitName,
        domain: parseDomainFromUnit,
      },
      total_code_served_count: +reqs,
      ad_exchange_impressions: +imps,
      invoiced_impressions: +invImp,
      day: date,
      report_origin: 'Google Ad Manager Commission'
    };
    return object;
  }

  async updateObject(object, reports) {
    reports.forEach(el => {
      if (
        this.checkDomain(el.property.domain, object.property.domain) &&
        el.property.property_id === object.property.property_id
      ) {
        object.property = {
          domain: el.property.domain,
          property_id: el.property.property_id,
          placement_name: el.property.placement_name,
          refs_to_user: el.property.refs_to_user,
          am: el.property.am
        };
      }
    })
    return new CommissionReports(object).save();
  }

  checkDomain(dom, objDom) {
    let result = false,
        regExpDomain = dom.match(/\./g);
    if (regExpDomain !== null && regExpDomain.length > 1) {
      result = dom.replace(/^[a-z]*\./, '').includes(objDom);
    } else {
      result = dom.includes(objDom);
    }
    if (
      objDom.includes('tsn') && dom.includes('tsn') ||
      objDom.includes('ixbt') && dom.includes('ixbt') ||
      objDom.includes('sport-express') && dom.includes('sport-express') ||
      objDom.includes('svpressa') && dom.includes('svpressa') ||
      objDom.includes('studme') && dom.includes('studme') ||
      objDom.includes('studbooks') && dom.includes('studbooks') ||
      objDom.includes('vuzlit') && dom.includes('vuzlit') ||
      objDom.includes('liveinternet') && dom.includes('liveinternet') ||
      objDom.includes('googlesyndication') && dom.includes('googlesyndication') ||
      objDom.includes('booksonline') && dom.includes('booksonline') ||
      objDom.includes('ok.ru') && dom.includes('ok.ru') ||
      objDom.includes('mail.ru') && dom.includes('mail.ru')
    ) {
      result = true;
    }
    return result;
  }

  getAdUnit(string) {
    if (string !== undefined) {
      const preResult = string.match("»") !== null ? string.substr(string.lastIndexOf("»") + 2) : string;
      return preResult.split(' (')[0].trim();
    }
  }

  getDomain(string) {
    if (string !== undefined) {
      if (string.search(/^[0-9]/) === -1) {
        if (string.search(/^amazon_/i) !== -1) {
          const preResult = string.toLowerCase().replace(/^amazon_new_|^amazon_/, '').replace(/_/, '.').split(/(_|\.)[0-9]|_.*/)[0].replace(/_/g, '.');
          return preResult.trim();
        }
        const preResult = string.toLowerCase().replace(/^(main|new|passback_for|spotx|outstream|instream|pre-roll)(\.|_)/i, '').replace(/_/, '.').split(/(_[0-9]|((_.*)|\.(fluid|passback|native|instream|outstream|spotx).*))|([0-9]{1,}.|\.[0-9]{1,}.)/i)[0];
        return preResult[preResult.length - 1] === '.' ? preResult.replace(/\./, '_').replace('.', '').replace('_', '.').trim() : preResult.trim();
      } else {
        const preResult = string.toLowerCase().split(/(^[0-9]{2,}x[0-9]{2,}.)|_.+$/).filter(el => {
          if (el !== undefined && el !== '') {
            if (el.search(/[0-9]{2,}/) === -1) {
              return el;
            } else if (el.search(/^\d.*\.(\w{2,4}|\w{2,4}\.\w{2,4})/) !== -1) {
              return el
            }
          }
        });
        if (preResult.length) {
          return preResult[0].trim();
        }
      }
    }
  }

  countingCommission(query) {
      try {
        const result = CommissionReports.aggregate(query).then(res =>{
          return res;
        });
        return result;
      } catch(err) {
        throw err;
      }
  };
}

module.exports = GoogleCommission;
