import { expect, assert } from "chai";
const sinon = require("sinon");

const GetReportsSizes = require('../../server/services/reporting/GetFilterValues/FilterFunctions/GetReportsSizes/GetReportsSizes.js');
const { searchReportsSizes } = require('../../server/services/reporting/GetFilterValues/FilterFunctions/GetReportsSizes/getReportsSizes-Performers');
const getRandomUserByRole = require('../../server/services/reporting/GetFilterValues/FilterFunctions/GetReportsSizes/helperFunctions/getRundomUserByRole');
import ServiceRunner from '../../server/services/ServiceRunner';

const mongooseFake = require('../fake-mongoose/mongooseFake');
const { fakeReports } = require('../fake-db-data/fakeReports');
const { fakeUsers } = require('../fake-db-data/fakeUsersByRole');

mongooseFake.prepareMongoUnit();

describe('Get Reports Sizes', () => {
    let serverFunc = null;
    let res = null;

    before('start fake mongodb server', async () => {
        serverFunc = ServiceRunner(GetReportsSizes, (req) => { return { body: req.body, params: req.params }});
        await mongooseFake.connect();

        const reports = fakeReports.getReports();
        const admins = fakeUsers.getAdmins();
        const publishers = fakeUsers.getPublishers();
        const fakeCollections = {
            reports,
            users: [
               ...admins,
               ...publishers
            ]
        };

        await mongooseFake.setCollections({ fakeCollections });
    })

    after(async () => {
        await mongooseFake.disconnect();
    })

    beforeEach(() => {
        res = { send: sinon.spy() };
    });

    it('Call GetReportsSizes by Admin Id', async function() {
        const role = 'ADMIN';
        const id = await getRandomUserByRole(role);
        const req = {
            body: {
                additional: { permission: 'canReadAllReports', id }
            },
            params: { search: 'Fluid' }
        };

        await serverFunc(req, res)
            .then( () => {
                const response = res.send.firstCall.args;
                const responseSizes = response[0];
                checkSizesRes(responseSizes);
            })
            .catch(error => {
                throwError(error.message)
            });
    });

    it('Call GetReportsSizes by Publisher Id', async function() {
        const role = 'PUBLISHER';
        const id = await getRandomUserByRole(role);
        const req = {
            body: {
                additional: { permission: 'canReadAllReports', id }
            },
            params: { search: 'Fluid' }
        };

        await serverFunc(req, res)
            .then( () => {
                const response = res.send.firstCall.args;
                const responseSizes = response[0];
                checkSizesRes(responseSizes);
            })
            .catch(res => throwError(res.message));
    });

    describe('Check Get Reports Sizes Errors', function() {
        it('Error Not Allowed Permissions GetReportsSizes', async () => {
            const req = {
                body: {
                    additional: { permission: 'NotExistPermission' }
                },
                params: { search: '30' }
            };

            await serverFunc(req, res)
            .catch(err => {
                expect(err.message).to.equal('FORBIDDEN');
            });
        });

        it('Error Not Valid Params GetReportsSizes', async () => {
            const req = {
                body: {
                    additional: { permission: 'canReadAllReports' }
                }
                // Not assigned params
            };

            await serverFunc(req, res)
            .catch(err => {
                expect(err.message).to.equal('params is not valid');
            });
        });

        it('Error Not Found Search, searchReportsSizes', async () => {
            const params = {};
            const { error, sizes } = await searchReportsSizes(params);

            expect(sizes).to.be.undefined;
            expect(error).to.have.property('msg');
            expect(error.msg).to.contain('search object is not found');
        });
    });
});

const checkSizesRes = (response) => {
    const { _id, name, results, error } = response;

    expect(error).to.be.null;
    expect(name).to.be.equal('SIZES');
    expect(_id).to.be.equal('29002');
    expect(results).to.be.a('array');
    results.forEach((str) => assert.isString(str, 'All element must be a string.'));
}

const throwError = (errorString) => { throw new TypeError(errorString) };
