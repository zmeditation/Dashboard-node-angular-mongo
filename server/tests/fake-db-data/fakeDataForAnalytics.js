const mongoose = require('mongoose');

function fakeDataForAnalytics () {

  function getReports() {
    return reports;
  }

  function getUsers() {
    return [...publishersWithSpecificData, ...managers];
  }

  return Object.freeze({
    getReports,
		getUsers
  })
}

module.exports = {
  fakeDataForAnalytics: fakeDataForAnalytics()
}

const getYesterday = () => {
  const nowDate = new Date();
  const yesterdayInMs = nowDate.setDate(nowDate.getDate() - 1);
  return new Date(yesterdayInMs);
}

const managers = [
  {
    _id: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
    connected_users: {
      p: [
        '5fd9e3ddaf4ae2d75536f7d7',
        '60781fcbf357e09c7b258575',
        '607807047bab23078037d1d0'
      ]
    },
    role: 'SENIOR ACCOUNT MANAGER',
    name: 'serious SAM',
    photo: '73a84730-596f-4947-aa74-34eea12f2337.png'
  }
]

const publishersWithSpecificData = [
  // publisher for last thirty days and current month
  {
    commission: { commission_number: 0, commission_type: 'eCPM' },
    enabled: { changed: false, status: true },
    connected_users: { p: [], am: [] },
    sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
    _id: mongoose.Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
    name: 'mail.ru',
    role: 'PUBLISHER',
    email: 'mail@mail.mail',
    password: 'password',
    createdAt: getYesterday(),
    uuid: '8d667932-a993-44b2-99c5-a4c42aa60f5b'
  },
  {
    commission: { commission_number: 30, commission_type: 'eCPM' },
    enabled: { changed: false, status: true },
    connected_users: { p: [], am: [] },
    sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
    _id: mongoose.Types.ObjectId('60781fcbf357e09c7b258575'),
    name: 'May_20',
    role: 'PUBLISHER',
    email: 'may@may.may',
    uuid: 'd78d2160-3a97-461e-85dd-5f435ff37226',
    createdAt: getYesterday(),
  },
  {
    commission: { commission_number: 30, commission_type: 'eCPM' },
    enabled: { changed: false, status: true },
    connected_users: { p: [], am: [] },
    sam: mongoose.Types.ObjectId('5ff43848f428a44ffc88f165'),
    _id: mongoose.Types.ObjectId('607807047bab23078037d1d0'),
    name: 'April 20',
    role: 'PUBLISHER',
    email: 'ap@ap.ap',
    password: '$2b$10$v1NryuZL3MforA/SAyTHNec9zm8q4fMbd1wBi/Y9uk6Pg.xR13cY6',
    uuid: 'ada91e6d-a23b-4f2d-9b7e-15966d8cc7e0',
    createdAt: getYesterday()
  }
];

const reports = [
  // mail.ru`s reports
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f736'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f737'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f738'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },

  // May_20`s reports
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('60781fcbf357e09c7b258575'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f739'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('60781fcbf357e09c7b258575'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f740'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('60781fcbf357e09c7b258575'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f741'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },

  // April 20`s reports
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('607807047bab23078037d1d0'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f742'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('607807047bab23078037d1d0'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f743'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('607807047bab23078037d1d0'),
      sam: mongoose.Types.ObjectId('5fe20f7f908754585419117a'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1236,
      height: 180,
      inventory_type: 'banner'
    },
    day: getYesterday(),
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f744'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 300,
    matched_request: 500,
    ecpm: 2000,
    createdAt: getYesterday(),
  }
];






