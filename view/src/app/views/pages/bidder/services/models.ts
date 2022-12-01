export class User {
  name: string;

  id: number;

  configs: number;

  domains: string[];
}

export class Config {
  name: string;

  id: number;

  adapters: Array<string>;

  sizes: string;

  type: string;

  cmp: boolean;

  amazon: boolean;

  isCopy?: boolean;

  dev?: string;
}

export type DialogData = {
  username?: string;
  fulltag?: string;
  passbackTag?: string;
  domain?: string;
}

export type EditDialogData = {
  adapter: { name: string; settings: Array<any> };
  preview: boolean;
}

export type ConfigsRow = {
  name: string;
  id: number;
  adapters: string[];
  type: string;
  sizes: string;
  amazon: string;
  cmp: string;
  isCopy?: boolean;
}

export type BidOption = {
  description: string;
  example: string;
  option: string;
  required: boolean;
  type: string;
  show?: boolean;
}

export type BidderSettings = {
  GDPR: boolean;
  SChain: boolean;
  code: string;
  media_types: string[];
  name: string;
  hasNonRequired?: boolean;
  options: BidOption[];
}

export type EditQuery = {
  name: string;
  width: number;
  height: number;
  configname: string;
  domain: string;
  PREBID_TIMEOUT: string;
  floorPrice: number;
  crid: string;
  passbacktag: string;
  cdnpath: string;
  userId: number;
  siteId: number;
  configid: number;
  adaptersList: string;
  settings: string;
  amazon: boolean;
  amazonID?: string;
  amazonAdUnitCode?: string;
  cmp: boolean;
  cmpTimeout?: number;
  usp: boolean;
  uspTimeout?: number;
  cmpType: string;
  customCode?: string;
  adUnitCode?: string;
  createdBy?: string;
  typeOfConfig?: string;
  setDomain?: boolean;
  analyticsEnable?: boolean;
  analytics?: string[];
  analyticsOptions?: string;
  currency?: string | undefined;
  marketplace?: boolean;
  marketplaceSettings?: any;
  mainAdapters?: string[];
  mainSettings?: string;
  shortTag?: any;
  schain?: boolean;
  schainObject?: string;
  supplyChain?: boolean;
  dev?: boolean;
  adExId?: string;
  dashboardId?: string;
  logo?: boolean;
  thirdPartyCMP?: boolean
}

export const Currencies = [
  'CAD',
  'HKD',
  'ISK',
  'PHP',
  'DKK',
  'HUF',
  'CZK',
  'GBP',
  'RON',
  'SEK',
  'IDR',
  'INR',
  'BRL',
  'RUB',
  'HRK',
  'JPY',
  'THB',
  'CHF',
  'EUR',
  'MYR',
  'BGN',
  'TRY',
  'CNY',
  'NOK',
  'NZD',
  'ZAR',
  'USD',
  'MXN',
  'SGD',
  'AUD',
  'ILS',
  'KRW',
  'PLN'
].sort();

export const Sizes = [
  '1x1',
  '88x31',
  '120x20',
  '120x30',
  '120x60',
  '120x90',
  '120x240',
  '120x600',
  '125x125',
  '160x600',
  '168x28',
  '168x42',
  '180x150',
  '200x200',
  '200x446',
  '216x36',
  '216x54',
  '220x90',
  '234x60',
  '240x133',
  '240x400',
  '250x250',
  '250x350',
  '250x400',
  '292x30',
  '300x31',
  '300x50',
  '300x75',
  '300x100',
  '300x250',
  '300x300',
  '300x600',
  '320x50',
  '320x100',
  '320x480',
  '336x280',
  '468x60',
  '480x320',
  '728x90',
  '768x1024',
  '970x90',
  '970x250',
  '1024x768'
];

export type CurrencyObject = {
  enabled: boolean;
  defaultCurrency: string;
}

export type MarketplaceObject = {
  marketplaceEnabled: boolean;
  adapters: string[];
  settings: string;
  enabled: boolean;
}

export type WbidConfig = {
  currency?: CurrencyObject;
  marketplace?: MarketplaceObject;
  schain?: boolean;
  schainObject?: any;
  isPrebidConfig: boolean;
  userId: number;
  siteId: number;
  typeOfConfig: string;
  adUnitCode?: string;
  networkId?: string;
  configName: string;
  existDomain: string;
  existSize: string;
  existAdapters: string[];
  disabledAdapters?: string[];
  existSettings: any;
  amazon?: boolean;
  amazonID?: string;
  amazonAdUnitCode?: string;
  cmp: boolean;
  usp?: boolean;
  cmpTimeout?: number;
  uspTimeout?: number;
  crid?: string;
  passbacktag: string;
  floorPrice: number;
  PREBID_TIMEOUT: number;
  cdnpath: string;
  cmpType?: string;
  customCode?: string;
  createdBy: string;
  updatedBy: string;
  setDomain: boolean;
  analyticsEnable: boolean;
  existAnalyticsAdapters?: string[];
  existAnalyticsOptions?: any;
  shortTag?: boolean;
  dev?: boolean;
  adExId?: string;
  logo?: boolean;
  existMarketplaceAdapters?: string[];
  thirdPartyCMP?: boolean
}
