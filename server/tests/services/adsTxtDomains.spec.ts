
import chai from 'chai';
const expect = chai.expect;
const assert = chai.assert;
import sinon from 'sinon';

import path from 'path';
import fs from 'fs';
const fsPromise = fs.promises;

import ServiceRunner from '../../server/services/ServiceRunner';
import mongooseFake from '../fake-mongoose/mongooseFake';
import { fakeDataForAnalytics } from '../fake-db-data/fakeDataForAnalytics';
import { GetCheckedDomainsService } from '../../server/services/users/AdsTxtDomains/GetCheckedDomainsService';
import { CheckedDomains } from '../../server/services/users/AdsTxtDomains/CheckedDomains';
import { GetCheckedDomains } from '../../server/services/users/AdsTxtDomains/GetCheckedDomains';

mongooseFake.prepareMongoUnit();

const validateGetCheckedDomains = (result) => {
	expect(result.data).to.be.a('object');

	const { type, attributes } = result.data;
	expect(type).to.be.a('string');
	expect(attributes).to.be.a('object');

	const { filteredResult, userWhoUpdated, lastUpdate } = attributes;
	expect(filteredResult).to.be.a('array');
	expect(userWhoUpdated).to.be.a('string');
	expect(lastUpdate).to.be.a('number');
	validateLastUpdate(lastUpdate);
}

const getEightHoursAgoInMs = () => {
	const nowDate = new Date();
	return nowDate.setHours(nowDate.getHours() -8);
}

const validateLastUpdate = (lastUpdate) => {
	const eightHoursAgoInMs = getEightHoursAgoInMs();
	const isOldTime = eightHoursAgoInMs < lastUpdate;
	assert(isOldTime, 'lastUpdate is older then 8 hours ago');
}

const checkDomainsData = (domainData) => {
	const { statusCode, message, lastUpdate, userWhoUpdated, results } = domainData;

	statusCode && expect(statusCode).to.be.a('number');
	message && expect(message).to.be.a('string');
	expect(results).to.be.a('array');
	expect(lastUpdate).to.be.a('number');
	validateLastUpdate(lastUpdate);
	expect(userWhoUpdated).to.be.a('string');
	const userId = '5fe20f7f908754585419117a';
	expect(userWhoUpdated).to.equal(userId);
}

describe('Check Ads.txt', () => {
	const pathToFile = path.join(__dirname, '../../server/services/users/AdsTxtDomains/storage/adsCheckListForTest.json');
	const userId = '5fe20f7f908754585419117a';

	before(async () => {
		await mongooseFake.connect();

		const users = fakeDataForAnalytics.getUsers();
		const fakeCollections = {
				users
		};

		await mongooseFake.setCollections({ fakeCollections });
	})

	after(async () => {
		await mongooseFake.disconnect();
	});

		// Must be calling first among tests
	describe('Test CheckedDomains', () => {
		let updateCheckedDomains = null;

		before(() => {
			updateCheckedDomains = new CheckedDomains(pathToFile);
		});

		it('should contain fields', () => {
			expect(updateCheckedDomains.settings).to.be.a('object');
			expect(updateCheckedDomains.fileService).to.be.a('object');

			const { filePath, folderPath } = updateCheckedDomains.fileService;
			expect(filePath).to.be.a('string');
			expect(folderPath).to.be.a('string');

			expect(updateCheckedDomains.pathToFile).to.be.a('string');
			expect(updateCheckedDomains.pathToFile).to.have.string('adsCheckListForTest');

			const {
				body: { additional: { permission, id } },
				filterId
			} = updateCheckedDomains.settings;
			expect(permission).to.be.a('string');
			expect(id).to.be.a('string');
			expect(id).to.equal('onlyForAdstxtMonitoring_ID');
			expect(filterId).to.be.a('string');
			expect(filterId).to.equal('69305');
		})

		it('CheckedDomains update', async () => {
			await updateCheckedDomains.update(userId);
		});

		it('should readFile adsCheckListForTest.json', async () => {
			const fileData = await fsPromise.readFile(pathToFile, 'utf-8');
			expect(fileData).to.be.a('string');
			const domainsData = JSON.parse(fileData);
			checkDomainsData(domainsData);
		});
	});

	describe('Test GetCheckedDomainsService', () => {
		let getCheckedDomainsService = null;

		before(async () => {
			getCheckedDomainsService = new GetCheckedDomainsService(pathToFile);
		});

		it('should contain fields', () => {
			expect(getCheckedDomainsService.fileService).to.be.a('object');
			const { filePath, folderPath } = getCheckedDomainsService.fileService;
			expect(filePath).to.be.a('string');
			expect(folderPath).to.be.a('string');
		});

		it('GetCheckedDomainsService canReadAllUsers', async () => {
			const { domainsObject, filteredResult } = await getCheckedDomainsService.canReadAllUsers();
			expect(filteredResult).to.be.a('array');
			checkDomainsData(domainsObject);
		});

		it('GetCheckedDomainsService canReadAllPubs', async () => {
			const { domainsObject, filteredResult } = await getCheckedDomainsService.canReadAllPubs(userId);
			expect(filteredResult).to.be.a('array');
			checkDomainsData(domainsObject);
		});

		it('GetCheckedDomainsService canReadOwnPubs', async () => {
			const { domainsObject, filteredResult } = await getCheckedDomainsService.canReadOwnPubs(userId);
			expect(filteredResult).to.be.a('array');
			checkDomainsData(domainsObject);
		});
	});

	describe('Test GetCheckedDomains', () => {
		let userId = '5fe20f7f908754585419117a';
		let req = {
			body: {
				additional: {
					permission: 'canReadAllUsers',
					id: userId
				}
			}
		};

		it(`unlink file`, async() => {
			const pathToAdsCheckList= path.join(__dirname, '../../server/services/users/AdsTxtDomains/storage/adsCheckList.json');
			if (!fs.existsSync(pathToAdsCheckList)) return;

			fs.unlink(pathToAdsCheckList, (err) => {
				expect(err).to.be.null;
				if (err) throw err;
			});
		})

		it(`should create file with data`, async() => {
			const serverFunc = ServiceRunner(GetCheckedDomains, (req) => { return { body: req.body}});

			const res = { send: sinon.spy() };
			await serverFunc(req, res);

			const result = res.send.firstCall.args[0];
			
			expect(result).to.be.a('object');
			expect(result.data).to.be.a('object');
			const { type, attributes } = result.data;
			expect(type).to.equal('ads.txt');
			expect(attributes).to.be.a('object');
		});

		it(`should call canReadAllUsers`, async() => {
			const serverFunc = ServiceRunner(GetCheckedDomains, (req) => { return { body: req.body}});

			const res = { send: sinon.spy() };
			await serverFunc(req, res);

			const result = res.send.firstCall.args[0];
			validateGetCheckedDomains(result);
		});

		it(`should call canReadAllPubs`, async() => {
			const serverFunc = ServiceRunner(GetCheckedDomains, (req) => { return { body: req.body}});

			const res = { send: sinon.spy() };
			req.body.additional.permission = 'canReadAllPubs';
			await serverFunc(req, res);

			const result = res.send.firstCall.args[0];
			validateGetCheckedDomains(result);
		});

		it(`should call canReadOwnPubs`, async() => {
			const serverFunc = ServiceRunner(GetCheckedDomains, (req) => { return { body: req.body}});

			const res = { send: sinon.spy() };
			req.body.additional.permission = 'canReadOwnPubs';
			await serverFunc(req, res);

			const result = res.send.firstCall.args[0];
			validateGetCheckedDomains(result);
		});

		// Must be Last test in the file
		it(`unlink file ${pathToFile}`, async() => {
			fs.unlink(pathToFile, (err) => {
				expect(err).to.be.null;
				if (err) throw err;
			});
		})
	})
});
