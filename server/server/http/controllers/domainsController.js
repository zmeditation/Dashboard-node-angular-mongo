import ServiceRunner from '../../services/ServiceRunner';
const GetDomains = require('../../services/domains/GetDomains/index');
const AddNewDomain = require('../../services/domains/AddDomain/index');
const UpdateDomain = require('../../services/domains/UpdateDomain/index');

module.exports = {
    getDomains: ServiceRunner(GetDomains, req => { return { body: req.body, query: req.query }}),
    addNewDomain: ServiceRunner(AddNewDomain, req => { return { body: req.body }}),
    updateDomain: ServiceRunner(UpdateDomain, req => { return { body: req.body }}),
}
