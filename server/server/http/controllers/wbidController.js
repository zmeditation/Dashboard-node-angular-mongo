import ServiceRunner from '../../services/ServiceRunner';
const WbidService = require('../../modules/wbid/services/wbidService');
const WBidManager = require('../../modules/wbid/services/wbidManager');
const adsTxtService = require('../../modules/wbid/services/adsTxt/adsTxtService');
const adsTxtManager = require('../../modules/wbid/services/adsTxt/adsTxtManager');
const Auth = require('../../modules/wbid/services/Auth/Auth');
const WBidAnalyticsCharts = require('../../modules/wbid/modules/analytics/charts/index');
const WBidAnalyticsReport = require('../../modules/wbid/modules/analytics/report/index');
const GetDomainsPlacements = require('../../modules/wbid/services/users/getDomainsPlacements/index');
const CountriesList = require('../../modules/wbid/services/reports/getCountries/index');
const DevicesConfig = require('../../modules/reporting/sharedFilters/devices/index');
const InventoryTypeConfig = require('../../modules/reporting/sharedFilters/inventory_type/index');
const SitesList = require('../../modules/reporting/sharedFilters/sites/index');
const OperationSystems = require('../../modules/reporting/sharedFilters/os/index');
const Browsers = require('../../modules/reporting/sharedFilters/browsers/index');
const SizesConfig = require('../../modules/reporting/sharedFilters/sizes/index');
const GetWbidPublishers = require('../../modules/wbid/services/users/getWbidPublishers/index')

module.exports = {
    wBidManager: WbidService(WBidManager, req => { return { body: req.body } }),
    adsTxtManager: adsTxtService(adsTxtManager, req => { return { body: req.body } }),
    getDomainsPlacements: WbidService(GetDomainsPlacements, req => { return { body: req.body } }),
    DfpAuth: ServiceRunner(Auth, req => { return { body: req.body } }),
    wBidAnalyticsCharts: ServiceRunner(WBidAnalyticsCharts, req => { return { body: req.body }}),
    wBidAnalyticsReport: ServiceRunner(WBidAnalyticsReport, req => { return { body: req.body }}),
    countriesList: ServiceRunner(CountriesList, req => { return { body: req.body }}),
    devicesConfig: ServiceRunner(DevicesConfig, req => { return { body: req.body }}),
    inventoryTypeConfig: ServiceRunner(InventoryTypeConfig, req => { return { body: req.body }}),
    sitesList: WbidService(SitesList, req => { return { body: req.body }}),
    operationSystemsList: WbidService(OperationSystems, req => { return { body: req.body }}),
    browsersList: WbidService(Browsers, req => { return { body: req.body }}),
    sizesConfig: ServiceRunner(SizesConfig, req => { return { body: req.body }}),
    getWbidPublishers: ServiceRunner(GetWbidPublishers, req => { return { body: req.body }})
};
