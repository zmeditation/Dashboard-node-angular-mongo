const mongoose = require('mongoose');

function fakeUsers () {

    function getAdmins() {
        return admins;
    }

    function getPublishers() {
        return publishers;
    }
  
    return Object.freeze({
        getAdmins,
        getPublishers
    });
}

module.exports = {
    fakeUsers: fakeUsers()
}

const admins = [
    {
        additional: {
          company: 'WMG Inc.',
          phone: '',
          skype: '',
          address: '',
          birthday: '1994-01-24T22:00:00.000Z',
          description: ''
        },
        commission: { commission_number: 0, commission_type: 'no data' },
        enabled: { changed: false, status: true },
        connected_users: { p: [], am: [] },
        permissions: [
          'canSeeDashboardPage',
          'canSeeSettingsPage'
        ],
        domains: [],
        cwe: null,
        am: null,
        sam: null,
        date_to_connect_am: null,
        previouslyUploadedReports: [],
        wbidType: [],
        wbidUserId: null,
        _id: mongoose.Types.ObjectId('5fd9dc21af4ae2d75536f7d6'),
        name: 'admin-laslo',
        email: 'admin@admin.admin',
        password: 'password',
        role: 'ADMIN',
        updatedAt: '2021-02-26T10:45:36.457Z',
        createdAt: '2018-03-29T15:24:51.881Z',
        photo: '6cf2f768-a016-4c12-990b-c075fa73272a.png',
        __v: 2,
        uuid: 'fef95c8e-5dcc-4942-b1a2-a1a37735db05',
        generatedReport: '04f24902-c9da-41b3-8074-580fd8f1f02e',
        properties: [],
        wBidderUser: false
      },
      {
        additional: {
          company: '',
          phone: '',
          skype: '',
          address: '',
          birthday: null,
          description: ''
        },
        commission: { commission_number: 0, commission_type: 'eCPM' },
        enabled: { changed: false, status: true },
        connected_users: { p: [], am: [] },
        permissions: [
          'canSeeDashboardPage',
          'canAddAllUsers',
          'canSeeUsersPage'
        ],
        domains: [],
        cwe: true,
        am: null,
        sam: null,
        date_to_connect_am: null,
        previouslyUploadedReports: [ '602ba4effe46a954589a1291', '602ba42cfe46a954589a1290' ],
        wbidType: [],
        wbidUserId: null,
        _id: mongoose.Types.ObjectId('5fe1d84f152b8b3da8e67dd6'),
        name: 'Vladislav Hirsa',
        role: 'ADMIN',
        email: 'v.hirsa@adwmg.com',
        password: 'password',
        uuid: '55618f11-2802-40d1-84c3-75decaea5f9d',
        properties: [],
        updatedAt: '2021-02-16T11:01:26.404Z',
        createdAt: '2020-12-22T11:28:15.672Z',
        __v: 0,
        generatedReport: 'af2bf024-30a7-4b18-a505-0486a684f34d'
      },
      {
        additional: {
          company: '',
          phone: '',
          skype: '',
          address: '',
          birthday: null,
          description: ''
        },
        commission: { commission_number: 0, commission_type: 'eCPM' },
        enabled: { changed: false, status: true },
        connected_users: { p: [], am: [] },
        permissions: [
          'canSeeDashboardPage',
          'canAddAllUsers',
          'canSeeUsersPage',
        ],
        domains: [],
        cwe: null,
        am: null,
        sam: null,
        date_to_connect_am: null,
        previouslyUploadedReports: [],
        wbidType: [],
        wbidUserId: null,
        _id: mongoose.Types.ObjectId('601191b537f7b920ac0d33cc'),
        name: 'test_acc_design',
        role: 'ADMIN',
        email: 'dreemvn@gmail.com',
        password: 'password',
        uuid: '74bcb9f4-3ad3-427c-b4cf-f10e0429ebe7',
        properties: [],
        updatedAt: '2021-01-27T16:15:49.057Z',
        createdAt: '2021-01-27T16:15:49.057Z',
        __v: 0
      }
];

const publishers = [
  {
    additional: {
      company: '',
      phone: '',
      skype: '',
      address: '',
      birthday: null,
      description: ''
    },
    commission: { commission_number: 0, commission_type: 'eCPM' },
    enabled: { changed: false, status: true },
    connected_users: { p: [], am: [] },
    permissions: [
      'canSeeReportsPage',
      'canSeeOwnProfilePage',
      'canUploadAvatar',
      'canReadOwnAccountInfo'
    ],
    cwe: true,
    am: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
    sam: null,
    date_to_connect_am: '2020-12-22T00:00:00.000Z',
    previouslyUploadedReports: [],
    wbidType: [],
    wbidUserId: null,
    _id: mongoose.Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
    name: 'mail.ru',
    role: 'PUBLISHER',
    email: 'mail@mail.mail',
    password: 'password',
    properties: [],
    updatedAt: '2021-02-26T09:33:19.061Z',
    createdAt: '2018-12-03T09:25:19.589Z',
    __v: 9,
    uuid: '8d667932-a993-44b2-99c5-a4c42aa60f5b'
  },
  {
    additional: {
      company: 's',
      phone: '',
      skype: '',
      address: '',
      birthday: null,
      description: ''
    },
    commission: { commission_number: 35, commission_type: 'eCPM' },
    enabled: { changed: false, status: true },
    connected_users: { p: [], am: [] },
    permissions: [
      'canSeeReportsPage',
      'canSeeOwnProfilePage',
      'canUploadAvatar',
    ],
    domains: [],
    cwe: true,
    am: null,
    sam: null,
    date_to_connect_am: null,
    previouslyUploadedReports: [],
    wbidType: [],
    wbidUserId: null,
    _id: mongoose.Types.ObjectId('5fdb3d3f36efda18b4b1701a'),
    name: 'publisher_change',
    role: 'PUBLISHER',
    email: 'pub@pub.pub',
    password: 'password',
    uuid: '2526268b-a3c6-490f-b98f-c9cd1c6c6a6e',
    properties: [ ],
    updatedAt: '2020-12-18T16:44:23.093Z',
    createdAt: '2020-12-17T11:13:03.549Z',
    __v: 0
  },
  {
    commission: { commission_number: 30, commission_type: 'eCPM' },
    enabled: { changed: false, status: true },
    connected_users: { p: [], am: [] },
    permissions: [
      'canSeeReportsPage',
      'canSeeOwnProfilePage',
      'canUploadAvatar'
    ],
    domains: [],
    cwe: null,
    am: null,
    sam: null,
    date_to_connect_am: null,
    previouslyUploadedReports: [],
    wbidType: [],
    wbidUserId: null,
    _id: mongoose.Types.ObjectId('5fdcbb46c7d6ff1da4fb4392'),
    name: 'pub01',
    role: 'PUBLISHER',
    email: 'publisher@adwmg.com',
    password: 'password',
    uuid: '8d38905a-3cc4-4451-9ab2-db5bdd928e48',
    properties: [],
    updatedAt: '2020-12-18T14:23:02.226Z',
    createdAt: '2020-12-18T14:23:02.226Z',
    __v: 0
  },
];