const {create, remove, get, find, update} = require("../../../server/http/controllers/revenueController");
import { expect, assert } from 'chai';
import sinon from "sinon";
import 'mocha';
const {fakeRevenues} = require('../../fake-db-data/fakeRevenues');
const mongooseFake = require('../../fake-mongoose/mongooseFake');
mongooseFake.prepareMongoUnit();

describe('Revenues - main functionality', function () {

  const fakeCollections = {revenues: fakeRevenues.getRevenues()};
  const firstRevenue = fakeCollections.revenues[0];

  before('start fake mongodb server', async () => {
    await mongooseFake.connect();
    await mongooseFake.setCollections({fakeCollections});
  });

  after(async () => {
    await mongooseFake.disconnect();
  });

  xit('should get list of all revenues', async () => {
    const request = {};
    let response = {send: sinon.spy()};

    await get(request, response)
      .then(() => response.send.firstCall.args)
      .then(data => {
        console.log(data);
        expect(data).to.a('array');
        expect(data[0].result.length).to.be.equal(2);
        expect(data[0].result[0].revenue).to.a('number');
        expect(data[0].result[0].revenue).to.equal(455.12);
        assert.notStrictEqual(data[0].result[1]._id, firstRevenue._id);
      })
  });

  it('should create new revenue', async () => {
    const publisherId = '5fe47d588acefd39cc2f7472';
    const request = {
      body: {
        begin: new Date().toISOString(),
        end: new Date().toISOString(),
        revenue: 100,
        revenue_rtb: 10,
        deduction: -20,
        publisher: publisherId
      }
    };

    const response = {send: sinon.spy()};
    await create(request, response)
      .then(() => response.send.firstCall.args)
      .then(data => {
        expect(data).to.a('array');
        expect(data.length).to.be.equal(1);
        expect(data[0].result).to.be.equal('REVENUE_SAVED');
      })
  });

  it('should remove revenue from DB', async () => {
    const request = {
      query: {
        begin: '2020-12-01',
        end: '2020-12-31',
        mode: 'byDate'
      }
    };
    const response = {send: sinon.spy()};

    await remove(request, response)
      .then(() => response.send.firstCall.args)
      .then(data => {
        expect(data).to.a('array');
        expect(data.length).to.be.equal(1);
        expect(data[0].result).to.equal('REVENUES_DELETED');
      })
  });

  it('should edit existing revenue', async () => {
    const request = {
      body: {
        publisher: firstRevenue.publisher,
        begin: '2021-03-01',
        end: '2021-03-31',
        additional: {},
        revenue: 10000,
        deduction: -50.02
      }
    };
    const response = {
      send: sinon.spy(),
      status: function (s) { // stub for response.status()
        this.statusCode = s;
        return this;
      }
    };

    await (update(request, response))
      .then(() => response.send.firstCall.args)
      .then(data => {
        expect(data).to.a('array');
        expect(data.length).to.be.equal(1);
        expect(data[0].result).to.equal('REVENUE_UPDATED');
      })
  });

  it('should find revenue by date and publisher', async () => {
    const request = {
      query: {
        publisher: firstRevenue.publisher,
        begin: '2021-03-01',
        end: '2021-03-31'
      }
    };
    const response = {
      send: sinon.spy(),
      status: function (s) {
        this.statusCode = s;
        return this;
      }
    };
    await find(request, response)
      .then(() => response.send.firstCall.args)
      .then(data => {
        expect(data).to.a('array');
        expect(data.length).to.equal(1);
        expect(data[0].result[0].revenue).to.equal(10000);
      })
  });

  describe('Revenues - Error handling', async () => {
    const nonExistedId = '4ffc0dfaa8749a489454e681'; // non-existed publisher id

    it('should send correct error if revenue already exists', async () => {
      const request = {
        body: {
          publisher: firstRevenue.publisher,
          begin: '2021-03-01',
          end: '2021-03-31',
          additional: {},
          revenue: 10000,
          deduction: -50.02
        }
      };
      const response: any = {
        send: sinon.spy(),
        status: function (s) {
          this.statusCode = s;
          return this;
        }
      };
      await create(request, response)
        .then(() => response.send.firstCall.args)
        .then(data => {
          assert.strictEqual(response.statusCode, 208); // error status code - 208
          expect(data[0].result).to.equal('ALREADY_EXISTS');
        })
    });

    it('should send correct error if revenues not found', async () => {
      const request = {
        query: {
          publisher: nonExistedId
        }
      };
      const response: any = {
        send: sinon.spy(),
        status: function (s) {
          this.statusCode = s;
          return this;
        }
      };
      await (find(request, response))
        .then(() => response.send.firstCall.args)
        .then(data => {
          assert.strictEqual(response.statusCode, 204); // status code - NO CONTENT 204
          expect(data[0].result).to.equal('NOT_FOUND');
        });
    });

    it('should send correct error if required params missed', async () => {
      const request = {
        body: {
          publisher: nonExistedId
        }
      };
      const response: any = {
        send: sinon.spy(),
        status: function (s) {
          this.statusCode = s;
          return this;
        }
      };
      await update(request, response)
        .then(() => response.send.firstCall.args)
        .then(data => {
          assert.strictEqual(response.statusCode, 400); // status code - BAD REQUEST
          expect(data[0].result).to.equal('REQUIRED_PARAMS_MISSED');
        })
    });
  })
})
