const { expect } = require('chai');

const ManagersAnalyticsService = require('../../server/services/analytics/ManagersAnalytics/ManagersAnalyticsService');
const { fakeDataForAnalytics } = require('../fake-db-data/fakeDataForAnalytics');
const mongooseFake = require('../fake-mongoose/mongooseFake');

mongooseFake.prepareMongoUnit();

describe('ManagersAnalyticsService Methods', () => {
	let managersWithPubs, managersWithPubsId, 
	publishersId, pubsRepotrsRev, 
	dateIntervalsArr, publishersAnalytics, 
	managersAndPubsAnalytics, managersWithSumAnalytics = null;

	const managersAnalyticsService = new ManagersAnalyticsService();
	const datesRangeDefault = managersAnalyticsService.datesRangeDefault;

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

	it('should call getManagersWithPubs', async() => {
		managersWithPubs = await managersAnalyticsService.getManagersWithPubs();
		expect(managersWithPubs).to.be.a('array');

		managersWithPubs.forEach(manager => {
			const { _id, connected_users, name, photo } = manager;
			expect(_id).to.be.an.instanceOf(Object);
			expect(name).to.be.a('string');
			expect(photo).to.be.a('string');

			const { p: publishers } = connected_users;
			expect(publishers).to.be.a('array');
			publishers.forEach(publisher => {
				expect(publisher._id).to.be.an.instanceOf(Object);
				expect(publisher.commission).to.be.an.instanceOf(Object);
				expect(publisher.commission.commission_type).to.be.a('string');
			});
		});
	});

	it('should call assignCorrectConnectedPublishers', async() => {
		managersWithPubsId = await managersAnalyticsService.assignCorrectConnectedPublishers(managersWithPubs);
		expect(managersWithPubsId).to.be.a('array');

		managersWithPubsId.forEach(manager => {
			testMainAnalyticsData(manager);
		});
	});

	it('should call collectPublishersId', () => {
		publishersId = managersAnalyticsService.collectPublishersId(managersWithPubsId);
		expect(publishersId).to.be.a('array');
		publishersId.forEach(id => expect(id).to.be.an.instanceOf(Object));
	});

	it('should call getPublishersReportsRevenue', async() => {
		const params = { datesRange: datesRangeDefault, publishersId };
		pubsRepotrsRev = await managersAnalyticsService.getPublishersReportsRevenue(params);
		expect(pubsRepotrsRev).to.be.a('array', 'publishersId is not array');

		pubsRepotrsRev.forEach(obj => {
			expect(obj).to.be.instanceOf(Object);

			const { _id, date, revenue } = obj;
			expect(_id).to.be.instanceOf(Object);
			expect(date).to.be.a('string');
			expect(revenue).to.be.a('number');
		});
	});

	it('should call getDateIntervals', () => {
		const params = { datesRange: datesRangeDefault, interval: 'daily' };
		dateIntervalsArr = managersAnalyticsService.getDateIntervals(params);
		expect(dateIntervalsArr).to.be.a('array');
		
		dateIntervalsArr.forEach(str => {
			expect(str).to.be.a('string');
		});
		
		const fromDate = datesRangeDefault.from.toISOString().split('T')[0];
		const toDate = datesRangeDefault.to.toISOString().split('T')[0];

		const firstDayOfRange = dateIntervalsArr[0];
		const lastDayOfRange = new Date(dateIntervalsArr[dateIntervalsArr.length -1]);

		const todayInMs = lastDayOfRange.setDate(lastDayOfRange.getDate() +1);
		const today = new Date(todayInMs).toISOString().split('T')[0];

		expect(fromDate).to.equal(firstDayOfRange);
		expect(toDate).to.equal(today);
	});

	it('should call setPubsAnalytics', async() => {
		publishersAnalytics = await  managersAnalyticsService.setPubsAnalytics({ publishersId, pubsRepotrsRev, dateIntervalsArr });
		expect(publishersAnalytics).to.be.an.instanceOf(Array);

		publishersAnalytics.forEach(publisher => {
			const { publisherId, analyticsOfPub } = publisher;
			expect(publisherId).to.be.an.instanceOf(Object);
			expect(analyticsOfPub).to.be.a('array');

			analyticsOfPub.forEach(analytic => {
				expect(analytic.date).to.be.a('string');
				expect(analytic.revenue).to.be.a('number');
			});
		});
	});
	
	it('should call assignPublishersThemManagers', async() => {
		managersAndPubsAnalytics = await  managersAnalyticsService.assignPublishersThemManagers(managersWithPubsId, publishersAnalytics);
		expect(managersAndPubsAnalytics).to.be.a('array');

		managersAndPubsAnalytics.forEach(manager => {
			testMainAnalyticsData(manager);
			testPublishersAnalytics(manager.publishers_analytics);
		});
	});

	it('should call assignPublishersThemManagers', async() => {
		managersWithSumAnalytics = await  managersAnalyticsService.sumRevenueManagersPublishers(managersAndPubsAnalytics, dateIntervalsArr);
		expect(managersWithSumAnalytics).to.be.a('array');

		managersWithSumAnalytics.forEach(manager => {
			testMainAnalyticsData(manager);
			testPublishersAnalytics(manager.publishers_analytics);
			testAnalytics(manager.analytics);
		});
	});
	
	it('should call clearNeedLessFields', async() => {
		const	managers = managersAnalyticsService.clearNeedLessFields(managersWithSumAnalytics);
		expect(managers).to.be.a('array');
		
		managers.forEach(manager => {
			expect(manager).to.have.all.keys('_id', 'name', 'photo', 'analytics');

			const { _id, name, photo, analytics } = manager;
			expect(_id).to.be.an.instanceOf(Object);
			expect(name).to.be.a('string');
			expect(photo).to.be.a('string');

			testAnalytics(analytics);
		});
	});
});

const testMainAnalyticsData = (manager) => {
	const { _id, connected_publishers, name, photo } = manager;
	expect(_id).to.be.an.instanceOf(Object);
	expect(name).to.be.a('string');
	expect(photo).to.be.a('string');
	expect(connected_publishers).to.be.a('array');
	connected_publishers.forEach(id => expect(id).to.be.an.instanceOf(Object));	
} 

const testAnalytics = (analytics) => {
	analytics.forEach(analytic => {
		expect(analytic.date).to.be.a('string');
		expect(analytic.revenue).to.be.a('string');
	});
}

const testPublishersAnalytics = (publishers_analytics) => {
	publishers_analytics.forEach(analyticsArr => {
		analyticsArr.forEach(analytic => {
			expect(analytic.date).to.be.a('string');
			expect(analytic.revenue).to.be.a('number');
		});
	});
}