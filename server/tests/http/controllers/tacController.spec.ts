const TAC = require("../../../server/http/controllers/tacController");
import { expect, assert } from 'chai';
import sinon from "sinon";
const request = require('../../fake-db-data/tac-data')

describe('TAC Controller Tests', function () {

    it('Should get list of countries', async () => {
        let res = {send: sinon.spy()};
        await TAC.countriesList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('COUNTRIES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(250);
                expect(data[0].results[15].name).to.equal('Azerbaijan');
                expect(data[0].results[15].code).to.equal('AZ');
                expect(data[0].results[15]['alpha-3']).to.equal('AZE');
            });
    });

    it('Should get list of device types', async () => {
        let res = {send: sinon.spy()};
        await TAC.devicesConfig({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('DEVICES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(3);
                expect(data[0].results[2]).to.equal('tablet');
            });
    });

    it('Should get list of ad formats', async () => {
        let res = {send: sinon.spy()};
        await TAC.adTypeConfig({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('AD_TYPE');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(3);
                expect(data[0].results[1]).to.equal('inBannerVideo');
            });
    });

    it('Should get list of OS', async () => {
        let res = {send: sinon.spy()};
        await TAC.operationSystemsList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('OS');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(8);
                expect(data[0].results[1]).to.equal('Android');
            });
    });

    it('Should get list of browsers', async () => {
        let res = {send: sinon.spy()};
        await TAC.browsersList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('BROWSERS');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(12);
                expect(data[0].results[1]).to.equal('Atom');
            });
    });

    it('Should get list of sizes', async () => {
        let res = {send: sinon.spy()};
        await TAC.sizesConfig({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('SIZES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(43);
                expect(data[0].results[10]).to.equal('168x28');
            });
    });

    it('Should get list of programmatics', async () => {
        let res = {send: sinon.spy()};
        await TAC.programmaticsList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('Programmatics');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(3);
                expect(data[0].results[0]).to.equal('Google Ad Manager');
            });
    });

    xit('Should get TAC report', async () => {
        let res = {send: sinon.spy()};
        await TAC.tacAnalyticsReport(request, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].success).to.be.true;
                expect(data[0].total.requests).to.be.greaterThan(10000)
            });
    });

    xit('Should get list of active ad units', async () => {
        let res = {send: sinon.spy()};
        await TAC.adUnitsList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].success).to.be.true;
                expect(data[0].name).to.equal('AD_UNITS');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.be.greaterThan(1000);
            });
    });

    it('Should get list of publishers', async () => {
        let res = {send: sinon.spy()};
        request.body.additional.permission = 'canReadOwnTacReports'; // test user as publisher
        await TAC.publishersList(request, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].success).to.be.true;
                expect(data[0].name).to.equal('PUBLISHERS');
                expect(data[0].results.length).to.equal(0);
            });
    });

    it('Should not pass into report builder with incorrect permission', async () => {
        let res = {send: sinon.spy()};
        request.body.additional.permission = 'YouShallNotPass'; // set incorrect permission
        try {
            await TAC.tacAnalyticsReport(request, res)
                .then(() => res.send.firstCall.args)
                .then(data => {
                    console.log(data); // error - permission incorrect
                })
        } catch (e) {
            assert.strictEqual(e.message, 'FORBIDDEN');
        }
    });

})
