import { Injectable } from '@angular/core';
import { BidderSettings, EditQuery, WbidConfig } from './models';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Helpers {
  // check if we have valid JSON
  isJson(str: string): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  parseConfigData(data): any {
    return {
      userId: data.results.userId || data.results.UserId,
      siteId: data.results.SiteId || data.results.siteId,
      typeOfConfig: data.results.typeOfConfig,
      configId: data.results.id,
      configname: data.results.config.configname,
      domain: data.results.config.domain,
      width: data.results.config.size.width,
      height: data.results.config.size.height,
      sizes: data.results.sizes,
      settings: data.results.config.settings,
      adapters: Object.keys(JSON.parse(data.results.config.settings)),
      disabledAdapters: (() => {
        const settings = JSON.parse(data.results.config.settings);
        const arr = Object.entries(settings);
        const disabled = [];
        for (const a of arr) {
          for (const el of Object.keys(a[1])) {
            if (el === 'disabled' && a[1][el].data) {
              disabled.push(a[0]);
            }
          }
        }
        return disabled;
      })(),
      amazon: data.results.config.amazon,
      amazonID: data.results.config.amazonID,
      amazonAdUnitCode: data.results.config.amazonAdUnitCode,
      cmp: data.results.config.cmp,
      cmpTimeout: data.results.config.cmpTimeout,
      usp: data.results.config.usp,
      uspTimeout: data.results.config.uspTimeout,
      cmpType: data.results.config.cmpType || undefined,
      customCode: data.results.config.customCode || undefined,
      PREBID_TIMEOUT: data.results.config.PREBID_TIMEOUT,
      floorPrice: data.results.config.floorPrice,
      passbacktag: data.results.config.passbacktag,
      cdnpath: data.results.config.cdnpath,
      crid: data.results.inventory.cr ? data.results.inventory.cr[0].id : undefined,
      adUnitCode: data.results.config.adUnitCode,
      created: new Date(data.results.createdAt).toLocaleDateString(),
      updated: new Date(data.results.updatedAt).toLocaleDateString(),
      createdBy: data.results.config.createdBy,
      updatedBy: data.results.config.updatedBy,
      isEdited: data.results.createdAt !== data.results.updatedAt,
      setDomain: data.results.config.setDomain,
      analyticsEnable: data.results.config.analyticsEnable,
      analytics: (() => {
        if (
          !data.results.config.analytics || data.results.config.analytics === 'null' ||
          data.results.config.analytics === 'undefined'
        ) {
          return [];
        } else if (Array.isArray(data.results.config.analytics)) {
          return data.results.config.analytics;
        } else {
          return [data.results.config.analytics];
        }

      })(),
      analyticsOptions: data.results.config.analyticsOptions,
      currency: data.results.config.currency && this.isJson(data.results.config.currency) ? JSON.parse(data.results.config.currency) : '',
      marketplace:
        data.results.config.marketplace && data.results.config.marketplaceSettings && this.isJson(data.results.config.marketplaceSettings)
          ? JSON.parse(data.results.config.marketplaceSettings)
          : '',
      shortTag: data.results.config.shortTag,
      schain: data.results.config.schain,
      schainObject: data.results.config.schainObject,
      dev: data.results.config.dev,
      adExId: data.results.config.adExId,
      logo: data.results.config.logo,
      thirdPartyCMP: data.results.config.thirdPartyCMP
    };
  }

  parseConfigsList(data): any {
    const configsList = data.results.configs;
    const configs = configsList.map((config: any) => {
      return {
        name: config.configname,
        id: config.configid,
        adapters:
          config.marketplace === 'true' && config.marketplaceSettings
            ? (() => {
              const settings = JSON.parse(config.marketplaceSettings);
              config.adapters.push('WMG Marketplace');
              return config.adapters.filter((adapter) => !settings.adapters.includes(adapter));
            })()
            : config.adapters.sort(),
        sizes: config.sizes,
        type: config.type,
        cmp: config.cmp,
        amazon: config.amazon,
        currency: config.currency,
        marketplace: config.marketplace,
        analytics: config.analytics,
        shortTag: config.shortTag,
        schain: config.schain,
        dev: config.dev
      };
    });
    return { name: data.results.domain, configs };
  }

  parseUsersList(data): any {
    if (data.results && data.results.name === 'Error') {
      return [];
    }

    const usersList = data.results.users;
    return usersList.map((user: any) => {
      return {
        name: user.userData.name,
        id: user.userData.id,
        sites: user.sites,
        domains: user.domains,
        type: user.userData.type
      };
    });
  }

  parseAdaptersSettings(data: { results: BidderSettings[] }): any {
    data.results.forEach((set) => {
      set.options.forEach((option) => {
        if (option.required === false) {
          option.show = false;
          set.hasNonRequired = true;
        } else {
          option.show = true;
        }
      });
    });
    return data.results;
  }

  assignAdaptersSettings(typeOfAdapters, action): any | null {
    const el = action === 'add' ? 'adapter-settings' : 'bidder-adapters';
    if (typeOfAdapters === 'main' && !document.getElementById(el)) {
      return null;
    }

    if (typeOfAdapters === 'marketplace' && !document.getElementById('marketplace-adapters')) {
      return null;
    }

    const settings = {};
    const selector = typeOfAdapters === 'main' ? el : 'marketplace-adapters';
    const element: HTMLElement = document.getElementById(selector);
    const setOfSettings: HTMLCollectionOf<Element> = element.getElementsByClassName('adapter-settings-block');
    for (const set of (setOfSettings as unknown) as any[]) {
      const adapter = set.getElementsByTagName('mat-panel-title');
      const adapterID = adapter[0].id;
      settings[adapterID] = {};
      const obj = {};
      const thisSettings: HTMLCollectionOf<Element> = set.getElementsByClassName('adapter-settings-main');
      for (const s of (thisSettings as unknown) as any[]) {
        if (!s.getElementsByTagName('input')[0]) {
          continue;
        }

        const option = s.getElementsByTagName('input')[0].placeholder;
        const value = s.getElementsByTagName('input')[0].value;
        const type = s.querySelector('.second-row > span').textContent;
        obj[option] = { data: value, type };
        Object.assign(settings[adapterID], obj);
      }
    }
    return settings;
  }

  cleanRequestQuery(query): any {
    delete query.toAll;

    if (query.cmp === false) {
      delete query.cmpTimeout;
      delete query.cmpType;
      delete query.customCode;
      delete query.usp;
      delete query.uspTimeout;
      delete query.thirdPartyCMP;
    }

    if (query.cmpType && query.cmpType === 'basic') {
      delete query.customCode;
    }

    if (query.schain === false) {
      delete query.schainComplete;
      delete query.schainNodes;
      delete query.schainVer;
    }

    if (query.typeOfConfig === 'prebid') {
      delete query.passbacktag;
    } else if (query.typeOfConfig === 'postbid') {
      delete query.setDomain;
    }

    if (query.currency === '') {
      delete query.defaultCurrency;
    }

    if (query.analyticsEnable === false) {
      delete query.analytics;
      delete query.analyticsOptions;
    }

    return query;
  }

  cleanEditQuery(query: EditQuery): EditQuery {
    if (query.typeOfConfig === 'postbid') {
      delete query.adUnitCode;
      delete query.setDomain;
    } else if (query.typeOfConfig === 'prebid') {
      delete query.crid;
      delete query.passbacktag;
    }

    if (query.cmp === false) {
      delete query.cmpTimeout;
      delete query.cmpType;
      delete query.customCode;
      delete query.usp;
      delete query.uspTimeout;
      delete query.thirdPartyCMP;
    }

    if (query.analyticsEnable === false) {
      delete query.analytics;
      delete query.analyticsOptions;
    }

    if (query.amazon === false) {
      delete query.amazonAdUnitCode;
      delete query.amazonID;
    }

    if (query.marketplace === false) {
      delete query.marketplaceSettings;
      delete query.mainAdapters;
      delete query.mainSettings;
    }

    if (query.schain === false) {
      delete query.schainObject;
    }

    return query;
  }

  parseCurrentConfigData(data, isCopy): WbidConfig {
    return {
      currency: (() => {
        if (data.currency && data.currency !== '' && data.currency.active === true) {
          return {
            enabled: true,
            defaultCurrency: data.currency.defaultCurrency
          };
        } else {
          return {
            enabled: false,
            defaultCurrency: ''
          };
        }
      })(),
      marketplace: (() => {
        if (data.marketplace) {
          return {
            marketplaceEnabled: data.marketplace.enabled,
            adapters: data.marketplace.adapters,
            settings: data.marketplace.settings,
            enabled: true
          };
        } else {
          return {
            marketplaceEnabled: false,
            adapters: [],
            settings: '',
            enabled: false
          };
        }
      })(),
      schain: data.schain === 'true',
      schainObject: data.schainObject ? JSON.parse(data.schainObject) : {},
      isPrebidConfig: data.typeOfConfig === 'prebid',
      userId: data.userId || data.UserId,
      siteId: data.siteId,
      typeOfConfig: data.typeOfConfig,
      adUnitCode: data.adUnitCode,
      configName: isCopy ? data.configname + '_(copy)' : data.configname,
      existDomain: (() => {
        return data.domain.length > 50 ? data.domain.substring(0, 50) : data.domain;
      })(),
      existSize: isCopy ? '' : data.sizes,
      existAdapters:
        data.marketplace && data.marketplace.adapters ?
          data.adapters.filter((adapter) => !data.marketplace.adapters.includes(adapter))
          : data.adapters,
      existMarketplaceAdapters: Array.from(new Set([].concat(data.adapters, data.marketplace.adapters))),
      disabledAdapters: data.disabledAdapters,
      existSettings: JSON.parse(data.settings),
      amazon: data.amazon === 'true',
      amazonID: data.amazonID,
      amazonAdUnitCode: data.amazonAdUnitCode,
      cmp: data.cmp === 'true',
      usp: data.usp === 'true',
      cmpTimeout: data.cmpTimeout,
      uspTimeout: data.uspTimeout,
      crid: data.crid,
      passbacktag: data.passbacktag,
      floorPrice: parseFloat(data.floorPrice),
      PREBID_TIMEOUT: data.PREBID_TIMEOUT,
      cdnpath: data.cdnpath,
      cmpType: data.cmpType,
      customCode: (() => {
        if (
          data.customCode ===
          `consentManagement: {
                    cmpApi: "static",
                    consentData: {
                      getConsentData: cmp
                    }
                  },`
        ) {
          return `consentManagement: {
                     gdpr: {
                        cmpApi: "static",
                        consentData: {
                            getConsentData: cmp
                        }
                     }
                  },`;
        } else {
          return data.customCode;
        }

      })(),
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
      setDomain: data.setDomain === 'true',
      analyticsEnable: data.analyticsEnable === 'true',
      existAnalyticsAdapters: data.analytics,
      existAnalyticsOptions: data.analyticsOptions ? JSON.parse(data.analyticsOptions) : {},
      shortTag: data.shortTag,
      dev: data?.dev === 'true',
      adExId: data.adExId,
      logo: data?.logo === 'true',
      networkId: data.typeOfConfig === 'prebid' ? data.adUnitCode.split('/')[1] : '',
      thirdPartyCMP: data?.thirdPartyCMP === 'true'
    };
  }

  prepareFormPatchObject(config: WbidConfig, currentUser: string) {
    return {
      name: currentUser,
      configname: config.configName,
      domain: config.existDomain,
      sizes: config.existSize,
      amazon: config.amazon,
      cmp: config.cmp,
      cmpTimeout: config.cmpTimeout,
      usp: config.usp,
      uspTimeout: config.uspTimeout,
      PREBID_TIMEOUT: config.PREBID_TIMEOUT,
      floorPrice: config.floorPrice,
      passbacktag: config.passbacktag,
      cmpType: config.cmpType,
      customCode: config.customCode,
      adUnitCode: config.adUnitCode,
      networkId: config.networkId,
      setDomain: config.setDomain,
      currency: config.currency.enabled,
      defaultCurrency: config.currency.defaultCurrency,
      marketplace: config.marketplace.enabled,
      shortTag: config.shortTag,
      schain: config.schain,
      schainComplete: config.schain && config.schainObject ? config.schainObject.complete : '',
      schainVer: config.schain && config.schainObject ? config.schainObject.ver : '',
      schainNodes: config.schain && config.schainObject ? config.schainObject.nodes : '',
      adExId: config.adExId,
      logo: config.logo,
      thirdPartyCMP: config.thirdPartyCMP
    };
  }

  prepareEditQuery(
    form: FormGroup,
    config: WbidConfig,
    isCopy: boolean,
    isPrebidConfig: boolean,
    id: number,
    currentUser: string,
    newAdapters: string[],
    newSettings: any,
    analytics: string[],
    analyticsOptions: any,
    newMarketplaceSettings: any | null,
    dev: boolean
  ): EditQuery {
    const sizes: string[] = form.controls.sizes.value.split('x');

    const analyticsAdapters: string[] = analytics ?
      config.existAnalyticsAdapters.concat(analytics)
      : config.existAnalyticsAdapters;

    const adaptersList: string = newAdapters ?
      JSON.stringify(config.existAdapters.concat(newAdapters))
      : JSON.stringify(config.existAdapters);

    const settings = !newSettings ?
      JSON.stringify(config.existSettings)
      : JSON.stringify(Object.assign(config.existSettings, newSettings));

    const mainSettings = (() => {
      const set = JSON.parse(settings);
      if (config.marketplace.adapters.length) {
        config.marketplace.adapters.forEach((adapter) => {
          delete set[adapter];
        });
        return set;
      } else {
        return set;
      }
    })();

    return {
      name: currentUser,
      width: parseInt(sizes[0], 10),
      height: parseInt(sizes[1], 10),
      configname: isCopy ? form.controls.configname.value : config.configName,
      domain: form.controls.domain.value,
      PREBID_TIMEOUT: form.controls.PREBID_TIMEOUT.value,
      floorPrice: form.controls.floorPrice.value,
      crid: config.crid,
      passbacktag: form.controls.passbacktag.value,
      cdnpath: config.cdnpath,
      userId: config.userId,
      siteId: config.siteId,
      configid: id,
      adaptersList: adaptersList,
      settings: settings,
      amazon: form.controls.amazon.value,
      amazonID: config.amazonID,
      amazonAdUnitCode: config.amazonAdUnitCode,
      cmp: form.controls.cmp.value,
      cmpTimeout: form.controls.cmpTimeout.value || undefined,
      usp: form.controls.usp.value,
      uspTimeout: form.controls.uspTimeout.value || undefined,
      cmpType: form.controls.cmpType.value,
      customCode: form.controls.customCode.value,
      adUnitCode: `/${ form.controls.networkId.value }/${ form.controls.adUnitCode.value }`,
      createdBy: config.createdBy || 'undefined',
      typeOfConfig: isPrebidConfig ? 'prebid' : 'postbid',
      setDomain: form.controls.setDomain.value,
      analyticsEnable: analyticsAdapters.length > 0,
      analytics: analyticsAdapters,
      analyticsOptions: config.existAnalyticsOptions
        ? JSON.stringify(Object.assign(config.existAnalyticsOptions, analyticsOptions))
        : JSON.stringify(Object.assign({}, analyticsOptions)),
      currency: form.controls.currency.value
        ? JSON.stringify({
          active: true,
          defaultCurrency: form.controls.defaultCurrency.value
        })
        : '',
      marketplace: form.controls.marketplace.value,
      marketplaceSettings: form.controls.marketplace.value
        ? JSON.stringify({
          enabled: true,
          adapters: newMarketplaceSettings ?
            [].concat(config.marketplace.adapters, Object.keys(newMarketplaceSettings))
            : config.marketplace.adapters,
          settings: newMarketplaceSettings ?
            Object.assign(config.marketplace.settings || {}, newMarketplaceSettings)
            : config.marketplace.settings
        })
        : '',
      mainAdapters: newSettings ? [].concat(config.existAdapters, Object.keys(newSettings)) : config.existAdapters,
      mainSettings: JSON.stringify(mainSettings),
      shortTag: form.controls.shortTag.value,
      schain: form.controls.schain.value,
      schainObject: JSON.stringify({
        complete: form.get('schainComplete').value,
        ver: form.get('schainVer').value,
        nodes: form.get('schainNodes').value
      }),
      supplyChain: settings.includes('nodes'),
      dev: dev,
      adExId: form.controls.adExId.value || '',
      dashboardId: '',
      logo: form.controls.logo.value,
      thirdPartyCMP: form.controls.thirdPartyCMP.value
    };
  }
}
