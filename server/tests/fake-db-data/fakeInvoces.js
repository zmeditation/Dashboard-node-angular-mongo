const mongoose = require('mongoose');

function fakeInvoices () {

  function getInvoices() {
      return invoices;
  }

  return Object.freeze({
    getInvoices: getInvoices
  })
}

module.exports = {
    fakeInvoices: fakeInvoices()
}

const invoices = [
    {
        fileName: 'test_invoice_0.png',
        status: 'pending',
        name: 'invoice_0.png',
        publisher: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e680'),
        valid: {begin: new Date(), end: new Date()},
        cancelReason: 'test',
        _id: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e681'),
        updatedAt: new Date(),
        createdAt: new Date()
    },
    {
        fileName: 'test_invoice_1.png',
        status: 'pending',
        name: 'invoice_1.png',
        publisher: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e680'),
        valid: {begin: new Date(), end: new Date()},
        cancelReason: 'test',
        _id: mongoose.Types.ObjectId('5ffc0dfaa8699a489454e683'),
        updatedAt: new Date(),
        createdAt: new Date()
    }
]
