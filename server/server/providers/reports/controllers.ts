import CountReportsController from '../../http/controllers/reports/countReportsController';
import UpdateReportsController from '../../http/controllers/reports/updateReportsController';
import { countReportsService, pubAMUpdateReportsService } from './services';

const countReportsController = new CountReportsController(countReportsService);
const updateReportsController = new UpdateReportsController(pubAMUpdateReportsService);

export {
  countReportsController,
  updateReportsController
};
