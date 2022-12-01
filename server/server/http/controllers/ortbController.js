import ServiceRunner from '../../services/ServiceRunner';
const CountriesList = require('../../modules/wbid/services/reports/getCountries/index');
const RtbSizes = require('../../modules/reporting/sharedFilters/rtbSizes/index');
const OperationSystems = require('../../modules/reporting/sharedFilters/os/index');
const Browsers = require('../../modules/reporting/sharedFilters/browsers/index');
const OrtbAnalyticsReport = require('../../modules/ortb/modules/reports/api/index');
const DspList = require('../../modules/ortb/modules/reports/api/filters/dsps');
const DevicesTypesList = require('../../modules/ortb/modules/reports/api/filters/deviceTypes');
const CurrenciesList = require('../../modules/ortb/modules/reports/api/filters/currencies');
const ImpTypesList = require('../../modules/ortb/modules/reports/api/filters/impressionTypes');
const SourcesList = require('../../modules/ortb/modules/reports/api/filters/sourcesList');
const IsHbFilter = require('../../modules/ortb/modules/reports/api/filters/isHb');
const SspList = require('../../modules/ortb/modules/reports/api/filters/ssp');
const SspDomainsList = require('../../modules/ortb/modules/reports/api/filters/sspDomains');
const SspPubIdList = require('../../modules/ortb/modules/reports/api/filters/sspPubId');
const AdUnitsList = require('../../modules/ortb/modules/reports/api/filters/adUnits');
const PartnersList = require('../../modules/ortb/modules/reports/api/filters/partnersList');

module.exports = {
    dspList: ServiceRunner(DspList, req => { return { body: req.body }}),
    countriesList: ServiceRunner(CountriesList, req => { return { body: req.body }}),
    devicesList: ServiceRunner(DevicesTypesList, req => { return { body: req.body }}),
    impTypesList: ServiceRunner(ImpTypesList, req => { return { body: req.body }}),
    domainsList: ServiceRunner(SspDomainsList, req => { return { query: req.query, body: req.query }}),
    operationSystemsList: ServiceRunner(OperationSystems, req => { return { body: req.body }}),
    sizesList: ServiceRunner(RtbSizes, req => { return { body: req.body }}),
    browsersList: ServiceRunner(Browsers, req => { return { body: req.body }}),
    ortbAnalyticsReport: ServiceRunner(OrtbAnalyticsReport, req => { return { body: req.body }}),
    adUnitsList: ServiceRunner(AdUnitsList, req => {return { body: req.body }}),
    publishersList: ServiceRunner(SspPubIdList, req => {return {body: req.body}}),
    currenciesList: ServiceRunner(CurrenciesList, req => { return { body: req.body }}),
    sourcesList: ServiceRunner(SourcesList, req => { return { body: req.body }}),
    sspList: ServiceRunner(SspList, req => {return { body: req.body}}),
    isHbFilter: ServiceRunner(IsHbFilter, req => { return { body: req.body }}),
    partnersList: ServiceRunner(PartnersList, req => { return {body: req.body }})
};
