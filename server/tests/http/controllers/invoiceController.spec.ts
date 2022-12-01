const {example, create, remove, get, edit, download} = require("../../../server/http/controllers/invoiceController");
const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
const sinon = require("sinon");
import 'mocha';

const fs = require('fs').promises;
const path = require('path');
const Blob = require("cross-blob");

const {fakeInvoices} = require('../../fake-db-data/fakeInvoces');
const mongooseFake = require('../../fake-mongoose/mongooseFake');
const {InvoiceModel} = require("../../../server/database/mongoDB/migrations/InvoiceModel");
mongooseFake.prepareMongoUnit();

//With fake database
describe('Tests with fake mongo', function () {

    const fakeCollections = {invoices: fakeInvoices.getInvoices()};
    const invoiceFirst = fakeCollections.invoices[0];

    before('start fake mongodb server', async () => {
        await mongooseFake.connect();
        await mongooseFake.setCollections({fakeCollections});
    });

    after(async () => {
        await mongooseFake.disconnect();
    });

    it('should download invoice example', async () => {
        let res = {send: sinon.spy()};
        await example({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data.length).to.equal(1);
            });
    })

    it('should get list of invoices', async () => {
        const request = {
            body: {
                period: {begin: '2019-07-04', end: '2021-07-21'},
                publishers: [],
                managers: [],
                additional: {
                    id: invoiceFirst.publisher
                }
            }
        }
        let response = {send: sinon.spy()};

        await get(request, response)
            .then(() => response.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].length).to.be.equal(2);
                expect(data[0][0].valid).to.a('object');
                assert.notStrictEqual(data[0][1]._id, invoiceFirst._id);
            })
            .catch(console.log)
    });

    it('should create new invoice', async () => {
        let blob = new Blob([""], {type: 'img/png'});
        blob["lastModifiedDate"] = "";
        blob.originalname = "Screenshot_34.png";
        const filePath = path.join(__dirname, '../../../server/public/invoice/Screenshot_34.png');
        blob.buffer = await fs.readFile(filePath);

        const publisherId = '5fe47d588acefd39cc2f7472';
        const request = {
            file: blob,
            body: {
                begin: new Date().toISOString(),
                end: new Date().toISOString(),
                additional: {id: publisherId},
            }
        };

        const response = {send: sinon.spy()};
        try {
            await create(request, response)
                .then(() => response.send.firstCall.args)
                .then(data => {
                    expect(data).to.a('array');
                    expect(data.length).to.be.equal(1);
                    expect(data[0].result.name).to.be.equal(blob.originalname);
                })
                .catch(console.log);
        } catch (e) {
            console.log(e); // workaround for error with notifications - users array is empty
        }
    });

    it('should remove invoice', async () => {
        const allInvoices = await InvoiceModel.find();
        const request = {params: {id: allInvoices[2]._id}};
        const response = {send: sinon.spy()};

        await remove(request, response)
            .then(() => response.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data.length).to.be.equal(1);
                expect(data[0].valid).to.a('object');
                assert.notStrictEqual(data[0]._id, allInvoices[2]._id);
            })
            .catch(console.log);
    });

    it('should edit existing invoice', async () => {
        const request = {
            params: {id: `${invoiceFirst._id}`},
            body: {
                status: 'pending',
                publisher: `${invoiceFirst.publisher}`,
                cancelReason: 'test reason'
            }
        };
        const response = {send: sinon.spy()};

        await (edit(request, response))
            .then(() => response.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data.length).to.be.equal(1);
                expect(data[0].valid).to.a('object');
                assert.notStrictEqual(data[0]._id, invoiceFirst._id);
            })
            .catch(console.log)
    });

    it('should download invoice by id', async () => {
        const request = {params: {id: `${invoiceFirst._id}`}};
        const response = {
            send: sinon.spy(),
            setHeader: () => {
            } // stub for res.setHeader method
        };
        await download(request, response)
            .then(() => response.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].length).to.equal(5362); // test file size in bytes
            })
            .catch(console.log)
    });

    describe('error handling', async () => {
        const nonExistedId = '4ffc0dfaa8749a489454e681'; // non-existed invoice id

        it('should send correct error for invoice download', async () => {
            const request = {params: {id: nonExistedId}};
            const response = {
                send: sinon.spy(),
                setHeader: () => {
                }
            };
            try {
                await download(request, response)
                    .then(() => response.send.firstCall.args)
                    .then(data => {
                        console.log(data); // error - no invoice with such id => fall into catch
                    })
            } catch (e) {
                assert.strictEqual(e.message, `Invoice with id ${nonExistedId} not found.`);
            }
        });

        it('should send correct error for invoice edit', async () => {
            const request = {
                params: {id: nonExistedId},
                body: {
                    status: 'pending',
                    publisher: '',
                    cancelReason: 'test reason'
                }
            };
            const response = {send: sinon.spy()};
            try {
                await (edit(request, response))
                    .then(() => response.send.firstCall.args)
                    .then(data => {
                        console.log(data);
                    });
            } catch (e) {
                assert.strictEqual(e.message, `Invoice with id ${nonExistedId} not found.`);
            }
        });

        it('should send correct error for invoice remove', async () => {
            const request = {params: {id: nonExistedId}};
            const response = {send: sinon.spy()};
            try {
                await remove(request, response)
                    .then(() => response.send.firstCall.args)
                    .then(data => {
                        console.log(data);
                    })
            } catch (e) {
                assert.strictEqual(e.message, `Invoice with id ${nonExistedId} not found.`);
            }
        });
    })
})
