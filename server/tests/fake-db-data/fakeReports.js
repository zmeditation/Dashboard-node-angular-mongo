const mongoose = require('mongoose');

function fakeReports () {

  function getReports() {
      return reports;
  }

  return Object.freeze({
    getReports
  })
}

module.exports = {
  fakeReports: fakeReports()
}

const reports = [
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('5fd9e3ddaf4ae2d75536f7d7'),
      am: mongoose.Types.ObjectId('5ff43848f428a44ffc88f165'),
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
    day: '2020-12-23T00:00:00.000Z',
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f736'),
    inventory_sizes: '1236x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 13,
    matched_request: 13,
    ecpm: 0.06,
    updatedAt: '2021-01-04T12:23:06.277Z',
    createdAt: '2020-12-24T10:26:08.897Z',
    __v: 0
  },
  {
    property: {
      placement_name: 'fluid',
      refs_to_user: mongoose.Types.ObjectId('5ff304e4499c651e306aa944'),
      am: mongoose.Types.ObjectId('5ff43848f428a44ffc88f165'),
      domain: 'articlesnew.com',
      property_id: 'articlesnew.com_fluidx180'
    },
    commission: { commission_number: 30, commission_type: 'eCPM' },
    inventory: {
      sizes: 'Fluid',
      width: 1244,
      height: 180,
      inventory_type: 'banner'
    },
    day: '2020-12-23T00:00:00.000Z',
    report_origin: 'Google Ad Manager',
    _id: mongoose.Types.ObjectId('5fe46cc0b9b628263cd9f738'),
    inventory_sizes: '1244x180',
    inventory_type: 'banner',
    clicks: 200,
    ad_request: 1,
    matched_request: 1,
    ecpm: 0.12,
    updatedAt: '2021-01-04T12:23:06.277Z',
    createdAt: '2020-12-24T10:26:08.897Z',
    __v: 0
  },
];