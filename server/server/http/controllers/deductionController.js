import ServiceRunner from '../../services/ServiceRunner';

const BulkAddDeductions = require('../../services/deduction/BulkAddDeductions');
const AddDeductionToPubl = require('../../services/deduction/AddDeductionToPubl/AddDeductionToPubl');
const GetPubsDeductions = require('../../services/deduction/GetPubsDeductions/GetPubsDeductions');
const GetAllPubsDeductions = require('../../services/deduction/GetAllPubsDeductions/GetAllPubsDeductions');
const GetDeductionByParam = require('../../services/deduction/getDeductionByParam/GetDeductionByParam');

module.exports = {
	addDeduction         : ServiceRunner(AddDeductionToPubl, ({ body }) => ({ body })),
	bulkAddDeduction     : ServiceRunner(BulkAddDeductions, ({ body }) => ({ body })),
	getPubsDeductions  	 : ServiceRunner(GetPubsDeductions, req => { return { body: req.body, query: req.query } }),
	getAllPubsDeductions : ServiceRunner(GetAllPubsDeductions, req => { return { body: req.body, publisherId: req.params.publisherId } }),
	getDeductionByParam  : ServiceRunner(GetDeductionByParam, req => { return { body: req.body } }),
}
