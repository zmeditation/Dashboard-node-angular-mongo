import ServiceRunner from '../../services/ServiceRunner';
const Tac = require('../../modules/tac/modules/generator/Tac');
const CountriesList = require('../../modules/wbid/services/reports/getCountries/index');
const DevicesConfig = require('../../modules/reporting/sharedFilters/devices/index');
const SizesConfig = require('../../modules/reporting/sharedFilters/sizes/index');
const adTypeConfig = require('../../modules/reporting/sharedFilters/ad_type/index');
const OperationSystems = require('../../modules/reporting/sharedFilters/os/index');
const Browsers = require('../../modules/reporting/sharedFilters/browsers/index');
const Programmatics = require('../../modules/reporting/sharedFilters/programmatics/index');
const TacAnalyticsReport = require('../../modules/tac/modules/reports');
const GetFilterValues = require('../../services/reporting/GetFilterValues/GetFilterValues');
const ActivePubsFilter = require('../../modules/tac/modules/reports/ActivePubsFilterService/index');

module.exports = {
    tacGenerator: ServiceRunner(Tac, req => {return { body: req.body }}),
    countriesList: ServiceRunner(CountriesList, req => { return { body: req.body }}),
    devicesConfig: ServiceRunner(DevicesConfig, req => { return { body: req.body }}),
    adTypeConfig: ServiceRunner(adTypeConfig, req => { return { body: req.body }}),
    domainsList: ServiceRunner(GetFilterValues, req => { return { body: req.body, filterId: req.url.slice(1) }}),
    operationSystemsList: ServiceRunner(OperationSystems, req => { return { body: req.body }}),
    sizesConfig: ServiceRunner(SizesConfig, req => { return { body: req.body }}),
    browsersList: ServiceRunner(Browsers, req => { return { body: req.body }}),
    programmaticsList: ServiceRunner(Programmatics, req => { return { body: req.body }}),
    tacAnalyticsReport: ServiceRunner(TacAnalyticsReport, req => { return { body: req.body }}),
    adUnitsList: ServiceRunner(ActivePubsFilter, req => {return { body: req.body }}),
    publishersList: ServiceRunner(GetFilterValues, req => {return {body: req.body, filterId: req.url.slice(1)}})
};
