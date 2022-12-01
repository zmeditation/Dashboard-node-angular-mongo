const cron = require('cron');
const { CheckedDomains } = require('./users/AdsTxtDomains/CheckedDomains');
const { dbAutoBackUp } = require('./backup.js');
const WritingAdUnitsInfoSmall = require('./API/GoogleAdManager/WritingAdUnitsInfo/writingAdUnitInfoSmall');
const deleteNoticesByDate = require('./notifications/queries/deleteNoticesByDate');
const PublishersConnectionStatisticsService = require('./analytics/GetPublishersConnectionStatistics/PublishersConnectionStatisticsService');
const { UpdateForLastThirtyDays } = require('./analytics/ManagersAnalytics/ForLastThirtyDays/UpdateForLastThirtyDays');
const revenueUpdate = require('../services/invoices/cronJobForRevenues');
const UpdateUserStatus = require('../modules/ortb/cron/updateAdapterStatus');

exports.updateManagersForLastThirtyDays = new cron.CronJob('30 08 * * 0-6', () => {
  const fakeArgs = { args: { body: { additional: true, runAnalyticsUpdate: true } } }
  const updateManagers = new UpdateForLastThirtyDays(fakeArgs);
  updateManagers.execute(fakeArgs.args)
    .catch(console.error);

}, null, false, 'Europe/Kiev');

exports.listForAdsTXT = new cron.CronJob('15 08 * * 0-6', () => {
  const pathToFile = `${__dirname}/users/AdsTxtDomains/storage/adsCheckList.json`;
  const postMessageList = new CheckedDomains(pathToFile);

  postMessageList.update()
    .then(status => {
      if (status) {
        console.log(status)
      }
    })
    .catch(console.error);
}, null, false, 'Europe/Kiev');

exports.DBAutoBackup = new cron.CronJob('0 0 * * 0', () => {
  dbAutoBackUp();
}, null, false, 'Europe/Kiev');

exports.WriteAdUnitsInfo = new cron.CronJob('0 8 * * WED', () => {

  const writeAdUnits = new WritingAdUnitsInfoSmall();
  writeAdUnits.writeAdUnitNames()
    .then(res => {
      if (res.error !== null) {
        console.log(error.msg);
      }
      console.log('Written down Google Ad Units Info.')
    })
    .catch(console.error);
}, null, false, 'Europe/Kiev');

exports.rewritePubsCountByMonth = new cron.CronJob('05 08 * * *', () => {
  const minRevenue = 100;
  const connectionService = new PublishersConnectionStatisticsService(minRevenue);
  const dateRange = connectionService.getCurrentYearRange();
  connectionService.getPublishersCountAnalytics({ dateRange })
    .catch(console.error);
}, null, false, 'Europe/Kiev');

exports.deleteNoticesByDateCron = new cron.CronJob('0 08 * * MON', () => {
  deleteNoticesByDate()
    .then(deletedMsgsCount => {
      console.log(`Deleted ${ deletedMsgsCount } notices.`);
    })
    .catch(console.error);
}, null, false, 'Europe/Kiev');

exports.revenueUpdate = new cron.CronJob('00 03 08 * *', async () => {
  try {
    console.log('Revenue data collection started!');
    await revenueUpdate();
    console.log('Revenue data collection finished');
  } catch (e) {
    console.error(e);
  }
}, null, false, 'Europe/Kiev');

exports.WeeklyUpdateUserStatus = new cron.CronJob('0 3 * * 1', async () => {
  try {
    const updater = new UpdateUserStatus('week');
    await updater.run();
  } catch (e) {
    console.error(e);
  }
}, null, false, 'Europe/Kiev');

exports.FirstUpdateUserStatus = new cron.CronJob('0 3 2 * *', async () => {
  try {
    const updater = new UpdateUserStatus('year');
    await updater.run();
  } catch (e) {
    console.error(e);
  }
}, null, false, 'Europe/Kiev');
