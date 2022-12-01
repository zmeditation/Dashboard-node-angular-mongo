const mongoose = require('mongoose');

function fakeRevenues() {

  function getRevenues() {
    return revenues;
  }

  return Object.freeze({
    getRevenues: getRevenues
  })
}

module.exports = {
  fakeRevenues: fakeRevenues()
}

const revenues = [
  {
    publisher: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e680'),
    begin: new Date('2021-03-01'),
    end: new Date('2021-03-31'),
    revenue: 455.12,
    revenue_rtb: 44.11,
    deduction: -77.55,
    _id: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e681'),
    updatedAt: new Date(),
    createdAt: new Date()
  },
  {
    publisher: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e680'),
    begin: new Date('2020-12-01'),
    end: new Date('2020-12-31'),
    revenue: 7855.01,
    revenue_rtb: 317.88,
    deduction: -102.34,
    _id: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e478'),
    updatedAt: new Date(),
    createdAt: new Date()
  }
]
