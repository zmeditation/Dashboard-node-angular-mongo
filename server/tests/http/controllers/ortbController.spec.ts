const ORTB = require("../../../server/http/controllers/ortbController");
import {expect, assert} from 'chai';
const sinon = require("sinon");
const request = require('../../fake-db-data/ortb-data')

describe('ORTB Controller Tests', () => {

    it('Should get list of DSPs', async () => {
        let res = {send: sinon.spy()};
        await ORTB.dspList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('DSP');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).greaterThan(0);
                expect(data[0].results[1]).to.equal('kadam');
            });
    });

    it('Should get list of countries', async () => {
        let res = {send: sinon.spy()};
        await ORTB.countriesList({}, res)
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
        await ORTB.devicesList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('DEVICES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(8);
                expect(data[0].results[2].name).to.equal('TV');
            });
    });

    it('Should get list of impression types', async () => {
        let res = {send: sinon.spy()};
        await ORTB.impTypesList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('IMPRESSION_TYPES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(3);
                expect(data[0].results[0]).to.equal('banner');
            });
    });

    xit('Should get list of domains', async () => {
        let res = {send: sinon.spy()};
        await ORTB.domainsList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('DOMAINS');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).greaterThan(350);
                expect(data[0].results[0].id).to.equal(842);
            });
    });

    it('Should get list of OS', async () => {
        let res = {send: sinon.spy()};
        await ORTB.operationSystemsList({}, res)
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
        await ORTB.browsersList({}, res)
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
        await ORTB.sizesList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('SIZES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(12);
                expect(data[0].results[1]).to.equal('160x600');
            });
    });

    it('Should get list of ad units', async () => {
        let res = {send: sinon.spy()};
        await ORTB.adUnitsList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('AD_UNITS');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).greaterThan(800);
                expect(data[0].results[1]).to.a('string');
            });
    });

    it('Should get list of currencies', async () => {
        let res = {send: sinon.spy()};
        await ORTB.currenciesList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('CURRENCIES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(171);
                expect(data[0].results[55]).to.equal('GNF');
            });
    });

    it('Should get list of traffic sources', async () => {
        let res = {send: sinon.spy()};
        await ORTB.sourcesList({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('SOURCES');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(2);
                expect(data[0].results[0]).to.equal('app');
            });
    });

    it('Should get list of demand sources', async () => {
        let res = {send: sinon.spy()};
        await ORTB.isHbFilter({}, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].name).to.equal('IS_HB');
                expect(data[0].results).to.a('array');
                expect(data[0].results.length).to.equal(2);
                expect(data[0].results[0].name).to.equal('hb');
            });
    });

    xit('Should get ortb report', async () => {
        let res = {send: sinon.spy()};
        await ORTB.ortbAnalyticsReport(request, res)
            .then(() => res.send.firstCall.args)
            .then(data => {
                expect(data).to.a('array');
                expect(data[0].success).to.be.true;
                expect(data[0].type).to.equal('ortb');
                expect(data[0].total.ssp_requests).to.be.greaterThan(10000)
            });
    });

    it('Should not pass into report builder with incorrect permission', async () => {
        let res = {send: sinon.spy()};
        request.body.additional.permission = 'YouShallNotPass';
        try {
            await ORTB.ortbAnalyticsReport(request, res)
                .then(() => res.send.firstCall.args)
                .then((data) => {
                    console.log(data); // error - incorrect permission
                })
        } catch (e) {
            assert.strictEqual(e.message, 'FORBIDDEN');
        }
    });
})
