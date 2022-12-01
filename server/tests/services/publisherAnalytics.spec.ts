import ServiceRunner from '../../server/services/ServiceRunner';
const { expect, assert } = require('chai');
const sinon = require("sinon");

const HandleAnalyticsFiles = require('../../server/services/analytics/handleAnalyticsFiles');
const GetForLastThirtyDays = require('../../server/services/analytics/PublishersAnalytics/ForLastThirtyDays/GetForLastThirtyDays');
const UpdateForLastThirtyDays = require('../../server/services/analytics/PublishersAnalytics/ForLastThirtyDays/UpdateForLastThirtyDays');

const { fakeDataForAnalytics } = require('../fake-db-data/fakeDataForAnalytics');
const mongooseFake = require('../fake-mongoose/mongooseFake');

// Functions for Get Analytics classes
const testGetAnalyticsClasses = async() => {
	const analyticsClasses = [GetForLastThirtyDays];

	analyticsClasses.forEach(analyticClass => {
		testsForGetClasses(analyticClass);
	});
}

const testsForGetClasses = (AnalyticClass) => {
	const res = { send: sinon.spy() };

	it(`should call ${AnalyticClass.name}`, async() => {
		const serverFunc = ServiceRunner(AnalyticClass, (req) => { return { body: req.body}});
		const req = {
			body: {
				additional: { permission: 'needLessPerm' }
			}
		};

		await serverFunc(req, res)
		.then(() => {
			const analytics = res.send.firstCall.args[0];
			checkAnalyticsObject(analytics);
		})
		.catch(console.log);
	});
}

// Functions for Update Analytics classes
const testUpdateAnalyticsClasses = async() => {
	const analyticsClasses = [UpdateForLastThirtyDays];

	analyticsClasses.forEach(analyticClass => {
		testsForUpdateClasses(analyticClass);
	});
}

const testsForUpdateClasses = (AnalyticClass) => {
	const res = { send: sinon.spy() };

	it(`should call ${AnalyticClass.name}`, async() => {
		const serverFunc = ServiceRunner(AnalyticClass, (req) => { return { body: req.body }});
		const req = {
			body: {
				additional: { permission: 'needLessPerm' },
				runAnalyticsUpdate: true
			}
		};

		await serverFunc(req, res)
		.then(() => {
			const analytics = res.send.firstCall.args[0];
			checkUpdatedAnalyticsObject(analytics)
		})
		.catch(console.log);
	});
}


describe('Check PublishersAnalytics', () => {
	before('start fake mongodb server', async () => {
			await mongooseFake.connect();

			const users = fakeDataForAnalytics.getUsers();
			const reports = fakeDataForAnalytics.getReports();
			const fakeCollections = {
					reports,
					users
			};

			await mongooseFake.setCollections({ fakeCollections });
		})

		after(async () => {
				await mongooseFake.disconnect();
		})

		testGetAnalyticsClasses();
		testUpdateAnalyticsClasses();
});

// Functions for check analytics result objects
const checkAnalyticsObject = (analyticsObj) => {
	expect(analyticsObj).to.be.an.instanceOf(Object);

	const { success, msg, analytics, last_update } = analyticsObj;
	expect(analytics).to.be.a('array');

	if (analytics.length) {
		expect(success).to.be.true;
		expect(msg).to.be.equal('SUCCESSFUL_REQUEST');
		expect(last_update).to.be.a('number');

		analytics.forEach(obj => {
			expect(obj).to.be.an.instanceOf(Object);

			const { _id, name, created_at, analytics: analyticsRevenue } = obj;
			expect(_id).to.be.a('string');
			expect(name).to.be.a('string');
			expect(created_at).to.be.a('string');
			expect(analyticsRevenue).to.be.a('array');

			analyticsRevenue.forEach(obj => {
				expect(obj).to.be.instanceOf(Object);
				expect(obj.date).to.be.a('string');
				expect(obj.revenue).to.be.a('string');
			});
		});

		return;
	}

	const defaultDataJSON = new HandleAnalyticsFiles('').getDefaultData();
	const defaultData = JSON.parse(defaultDataJSON);
	expect(last_update).to.be.equal(defaultData.last_update, 'Default last_update must be like in HandleAnalyticsFiles.getDefaultData');
}

const checkUpdatedAnalyticsObject = (analyticsObj) => {
	expect(analyticsObj).to.be.an.instanceOf(Object);

	const { success, msg, analytics, last_update } = analyticsObj;
	expect(success).to.be.true;
	expect(msg).to.be.equal('SUCCESSFUL_REQUEST');
	expect(analytics).to.be.a('array');
	expect(last_update).to.be.a('number');
	validateLastUpdate(last_update);

	analytics.forEach(obj => {
		expect(obj).to.be.an.instanceOf(Object);

		const { _id, name, created_at, analytics: analyticsRevenue } = obj;
		expect(_id).to.be.an.instanceOf(Object);
		expect(name).to.be.a('string');
		expect(created_at).to.be.an.instanceOf(Date);
		expect(analyticsRevenue).to.be.a('array');

		analyticsRevenue.forEach(obj => {
			expect(obj).to.be.instanceOf(Object);
			expect(obj.date).to.be.a('string');
			expect(obj.revenue).to.be.a('string');
		});
	});
}

const getEightHoursAgoInMs = () => {
	const nowDate = new Date();
	return nowDate.setHours(nowDate.getHours() -8);
}

const validateLastUpdate = (last_update) => {
	const eightHoursAgoInMs = getEightHoursAgoInMs();
	const isOldTime = eightHoursAgoInMs < last_update;
	assert(isOldTime, 'last_update is older then 8 hours ago');
}
