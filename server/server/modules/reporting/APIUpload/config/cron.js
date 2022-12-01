const cron = require('cron');
const { ManageAPI } = require('../index');
const { day: dayForPubMatic, month: monthForPubMatic } = require('../PubMatic/GetPubMaticToken/PubMaticData');
const GetPubMaticToken = require('../PubMatic/GetPubMaticToken/GetPubMaticToken');

exports.MyTargetAPI = new cron.CronJob(
  '55 11 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'MyTarget';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.gamHBAPIUpload = new cron.CronJob(
  '30 11 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Google Ad Manager HB';

    manageAPI
      .runAPIUpload({ programmatic })
      .then((status) => console.log(status?.msg))
      .catch((error) => console.error(error));
  },
  null,
  false,
  'Europe/Kiev'
);

exports.yandexAPIUpload = new cron.CronJob(
  '20 12 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Yandex';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.SharethroughAPIUpload = new cron.CronJob(
  '00 14 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Sharethrough';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);


exports.gamAPIUpload = new cron.CronJob(
  '00 12 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Google Ad Manager WMG';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.gamAPIUploadMRG = new cron.CronJob(
  '45 12 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Google Ad Manager MRG';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

// exports.gamCommissionAPIUpload = new cron.CronJob('00 13 * * 0-6', () => {
//     const manageAPI = new ManageAPI();
//     const programmatic = 'Google Ad Manager Commission';

//     manageAPI.runAPIUpload({ programmatic })
//         .then(status => console.log(status))
//         .catch(error => console.error(error));
// }, null, false, 'Europe/Kiev');

exports.criteoAPIUpload = new cron.CronJob(
  '05 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Criteo';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.appNexusAPIUpload = new cron.CronJob(
  '10 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'AppNexus';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.facebookAPIUpload = new cron.CronJob(
  '15 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Facebook';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.RTBHouseAPIUpload = new cron.CronJob(
  '20 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'RTBHouse';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.AdNetMediaAPIUpload = new cron.CronJob(
  '00 10 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'AdNet Media';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.LuponMediaAPIUpload = new cron.CronJob(
  '00 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Lupon Media';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.MediaNetAPIUpload = new cron.CronJob(
  '30 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'MediaNet';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.IndexExchangeAPIUpload = new cron.CronJob(
  '00 17 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'IndexExchange';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.OneTagAPIUpload = new cron.CronJob(
  '35 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'OneTag';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.EPlanningAPIUpload = new cron.CronJob(
  '25 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'E-Planning';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.pubMaticAPIUpload = new cron.CronJob(
  '30 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'PubMatic';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

/*exports.TeadsAPIUpload = new cron.CronJob('35 16 * * 0-6', () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Teads';

    manageAPI.runAPIUpload({ programmatic })
        .catch(console.log);
}, null, false, 'Europe/Kiev');*/

exports.rubiconAPIUpload = new cron.CronJob(
  '40 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Rubicon';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.amazonAPIUpload = new cron.CronJob(
  '45 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Amazon';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.bRealTimeAPIUpload = new cron.CronJob(
  '50 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'bRealTime';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.smartAPIUpload = new cron.CronJob(
  '55 16 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'Smart';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.districtMAPIUpload = new cron.CronJob(
  '00 17 * * 0-6',
  () => {
    const manageAPI = new ManageAPI();
    const programmatic = 'DistrictM';

    manageAPI.runAPIUpload({ programmatic }).catch(console.log);
  },
  null,
  false,
  'Europe/Kiev'
);

exports.PubMaticToken = new cron.CronJob(
  `05 17 ${dayForPubMatic} ${monthForPubMatic}  *`,
  () => {
    if (process.env.NODE_ENV === 'production') {
      const queryPubMatic = new GetPubMaticToken();
      queryPubMatic.changePubMaticData();
    }
  },
  null,
  false,
  'Europe/Kiev'
);
