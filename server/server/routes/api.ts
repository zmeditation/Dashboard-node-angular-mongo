import express from 'express';
import permissionsRoutes from './permissionsRoutes';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import reportsRoutes from './reportsRoutes';
import analyticsRoutes from './analyticsRoutes';
import wbidRoutes from './wbidRoutes';
import attachmentsRoutes from './attachmentsRoutes';
import deductionsRoutes from './deductionsRoutes';
import mediatorsRouters from './mediatorsRoutes';
import invoiceRoutes from './invoiceRoutes';
import tacRoutes from './tacRoutes';
import notificationsRoutes from './notificationsRoutes';
import domainsRoutes from './domainsRoutes';
import propertiesRoutes from './propertiesRoutes';
import ortbRoutes from './ortbRoutes';
import revenueRoutes from './revenueRoutes';
import versionRoutes from './versionRoutes';
import noticeRoutes from './noticeRoutes';
import codesRoute from './codesRoutes';

const router = express.Router();

// Auth Routes
router.use('/', authRoutes);
// Permissions
router.use('/permissions', permissionsRoutes);
// User Routes
router.use('/users', userRoutes);
// Reports Routes
router.use('/reports', reportsRoutes);
// Analytics Routes
router.use('/analytics', analyticsRoutes);
// WBid Routes
router.use('/wbid', wbidRoutes);
// Attachments Routes
router.use('/attachments', attachmentsRoutes);
// Deduction Routes
router.use('/deductions', deductionsRoutes);
// Mediators Routes
router.use('/mediators', mediatorsRouters);
// TAC Routes
router.use('/tac', tacRoutes);
/** Invoices */
router.use('/invoice', invoiceRoutes);
// Notifications Routes
router.use('/notifications', notificationsRoutes);
// oRTB Routes
router.use('/rtb', ortbRoutes);
/* Domains route */
router.use('/domains', domainsRoutes);
/* Properties/AdUnits routes */
router.use('/units', propertiesRoutes);
// revenue routes
router.use('/revenue', revenueRoutes);

router.use('/version', versionRoutes);

router.use('/notice', noticeRoutes);

router.use('/codes', codesRoute);

// export default not working
// https://stackoverflow.com/questions/29941208/express-error-typeerror-router-use-requires-middleware-function-but-got-a-o/34011640
module.exports = router;
