import ServiceRunner from '../../../services/ServiceRunner';

const path = require('path');
const multer = require('multer');

const DownloadServiceRunner = require('../../../services/DownloadServiceRunner');
const { ServiceForAPIReq } = require('../../../services/reporting/apiToken/helpers.js');

const GetMonthly = require('../../../services/reporting/GetMonthly/GetMonthly');
const RunCustomReport = require('../../../services/reporting/RunCustomReport/RunCustomReport');
const GetFilterValues = require('../../../services/reporting/GetFilterValues/GetFilterValues');
const GetValues = require('../../../services/reporting/GetOrigins/GetOrigins');
const GetPreviousUploads = require('../../../services/reporting/GetPreviousUploads/GetPreviousUploads');
const RemoveManuallyUploadedReport = require('../../../services/reporting/RemoveManuallyUploadedReport/RemoveManuallyUploadedReport');
const ManualUpload = require('../../../services/reporting/ManualUpload/ManualUpload');
const CsvUpload = require('../../../services/reporting/CsvUpload/CsvUpload');
const DownloadReport = require('../../../services/reporting/DownloadReport/DownloadReport');
const RemoveReports = require('../../../services/reporting/RemoveReports/RemoveReports');
const GetAPIAdapters = require('../../../services/reporting/GetAPIAdapters/GetAPIAdapters');
const UploadAPIReports = require('../../../services/reporting/UploadAPIReports/UploadAPIReports');
const GetPubsRevenue = require('../../../services/reporting/GetPubsRevenue/GetPubsRevenue');
const { equal } = require('assert');
const GetReportsSizes = require('../../../services/reporting/GetFilterValues/FilterFunctions/GetReportsSizes/GetReportsSizes');

export default {
  getMonthly: ServiceRunner(GetMonthly, (req) => {
    return { body: req.body, userId: req.params.userId, gfc: req.query.gfc };
  }),
  runCustomReport: ServiceRunner(RunCustomReport, (req) => {
    return { body: req.body };
  }),
  runApiCustomReport: ServiceRunner(
    RunCustomReport,
    (req) => {
      return ServiceForAPIReq(req);
    },
    false
  ),
  getFilterValues: ServiceRunner(GetFilterValues, (req) => {
    return { body: req.body, filterId: req.params.id };
  }),
  getReportsSizes: ServiceRunner(GetReportsSizes, (req) => {
    return { body: req.body, params: req.params };
  }),
  // getOrigins              : ServiceRunner(GetValues, req => { return { body: req.body, filterId: req.params }}),
  getPreviousUploads: ServiceRunner(GetPreviousUploads, (req) => {
    return { body: req.body };
  }),
  removeManuallyUploadedReport: ServiceRunner(RemoveManuallyUploadedReport, (req) => {
    return { body: req.body, reportId: req.params.reportId };
  }),
  manualUpload: ServiceRunner(ManualUpload, (req) => {
    return { body: req.body };
  }),
  csvUpload: ServiceRunner(CsvUpload, (req) => {
    return { body: req.body, file: req.file };
  }),
  downloadReport: DownloadServiceRunner(DownloadReport, (req) => {
    return { body: req.body };
  }),
  removeReports: ServiceRunner(RemoveReports, (req) => {
    return { body: req.body };
  }),
  getAPIAdapters: ServiceRunner(GetAPIAdapters, (req) => {
    return { body: req.body };
  }),
  uploadAPIReports: ServiceRunner(UploadAPIReports, (req) => {
    return { body: req.body };
  }),
  getPubsRevenue: ServiceRunner(GetPubsRevenue, (req) => {
    return { body: req.body };
  }),
  // ініціалізуємо малтер та вказуємо з .single(), що тільки один файл завантажуємо з name="csv" у view
  fileUpload: multer(getMulterOptions()).single('file')
};

function getMulterOptions() {
  return {
    // сторедж відповідає за те, куди зберегти файл і як його назвати
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const reportPath = path.join(__dirname, '../../../dist/reports');
        cb(null, reportPath);
      },
      filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        // при створенні назви потрібно обов'язково добавити формат файла
        cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
      }
    }),
    // функція для перевірки, чи це дійсно csv/excel файл
    fileFilter(req, file, next) {
      // використовуємо маймтайпи для перевірки
      const isCorrectFileType =
        file.mimetype.startsWith('application/vnd.ms-excel') ||
        file.mimetype.startsWith('text/csv') ||
        file.mimetype.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      isCorrectFileType ? next(null, true) : next({ message: "This Filetype isn't Allowed" }, false);
    }
  };
}
