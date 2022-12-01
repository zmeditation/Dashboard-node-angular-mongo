import ServiceRunner from '../../services/ServiceRunner';
import { GetForLastThirtyDays as GetManagersForLastThirtyDays } from '../../services/analytics/ManagersAnalytics/ForLastThirtyDays/GetForLastThirtyDays';
import { UpdateForLastThirtyDays as UpdateManagersForLastThirtyDays } from '../../services/analytics/ManagersAnalytics/ForLastThirtyDays/UpdateForLastThirtyDays';
import GetForLastThirtyDays from '../../services/analytics/PublishersAnalytics/ForLastThirtyDays/GetForLastThirtyDays';
import UpdateForLastThirtyDays from '../../services/analytics/PublishersAnalytics/ForLastThirtyDays/UpdateForLastThirtyDays';
import GetPublishersConnectionStatistics from '../../services/analytics/GetPublishersConnectionStatistics/GetPublishersConnectionStatistics';
import { Request } from '../../interfaces/express';

const controllerFuncs = {
  getManagersForLastThirtyDays: ServiceRunner(GetManagersForLastThirtyDays, (req: Request) => {
    return { body: req.body };
  }),
  updateManagersForLastThirtyDays: ServiceRunner(UpdateManagersForLastThirtyDays, (req: Request) => {
    return { body: req.body };
  }),

  getPublishersForLastThirtyDays: ServiceRunner(GetForLastThirtyDays, (req: Request) => {
    return { body: req.body };
  }),
  updatePublishersForLastThirtyDays: ServiceRunner(UpdateForLastThirtyDays, (req: Request) => {
    return { body: req.body };
  }),

  getPublishersConnectionStatistics: ServiceRunner(GetPublishersConnectionStatistics, (req: Request) => {
    return { body: req.body };
  })
};

export default controllerFuncs;
