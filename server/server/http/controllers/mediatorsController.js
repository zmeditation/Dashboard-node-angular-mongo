import ServiceRunner from '../../services/ServiceRunner';
const AddNewUnit = require('../../services/API/GoogleAdManager/AddUnit/AddUnit');
const GetAdUnits = require('../../services/API/GoogleAdManager/GetAdUnits/GetAdUnits');
const WritingAdUnitsInfo = require('../../services/API/GoogleAdManager/WritingAdUnitsInfo/WritingAdUnitsInfo');
const GetPackCode = require('../../services/API/codes/GetPackCode');
const DeletePackCode = require('../../services/API/codes/DeletePackCode');
const UpdatePackCode = require('../../services/API/codes/UpdatePackCode');

module.exports = {
  addNewUnit: ServiceRunner(AddNewUnit, req => {
    return { body: req.body }
  }),
  getAdUnits: ServiceRunner(GetAdUnits, req => {
    return { body: req.body }
  }),
  writingAdUnitsInfo: ServiceRunner(WritingAdUnitsInfo, req => {
    return { body: req.body }
  }),
  getPackCode: ServiceRunner(GetPackCode, req => {
    return { body: req.body }
  }),
  deletePackCode: ServiceRunner(DeletePackCode, req => {
    return { body: req.body, query: req.query }
  }),
  updatePackCode: ServiceRunner(UpdatePackCode, req => {
    return { body: req.body }
  })
}
