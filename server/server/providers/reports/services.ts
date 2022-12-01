import CountReportsService from '../../services/reporting/countReports/countReportsService';
import PubAMUpdateReportsService from '../../services/reporting/update/pubAMUpdate/pubAMUpdateService';

const countReportsService = new CountReportsService();
const pubAMUpdateReportsService = new PubAMUpdateReportsService();

export { countReportsService, pubAMUpdateReportsService };
