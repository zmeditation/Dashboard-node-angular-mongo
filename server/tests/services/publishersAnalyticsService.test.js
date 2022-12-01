const { expect } = require('chai');

const PublishersAnalyticsService = require('../../server/services/analytics/PublishersAnalytics/PublishersAnalyticsService');
const { fakeDataForAnalytics } = require('../fake-db-data/fakeDataForAnalytics');
const mongooseFake = require('../fake-mongoose/mongooseFake');

mongooseFake.prepareMongoUnit();

describe('PublishersAnalyticsService Methods', () => {
	let publishers, publishersId, pubsRepotrsRev, dateIntervalsArr, correctPubsObj, updatedPubs = null;

	const publishersAnalyticsService = new PublishersAnalyticsService();
	const createAtPubsRange = publishersAnalyticsService.createAtRangeDefault;
	const datesRangeDefault = publishersAnalyticsService.datesRangeDefault;

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

	it('should call getAllPublishers', async() => {
		publishers = await publishersAnalyticsService.getAllPublishers({createAtPubsRange});
		expect(publishers).to.be.a('array', 'publishers is not array');

		publishers.forEach(publisher => {
			const { _id, commission, name, createdAt } = publisher;
			expect(_id).to.be.an.instanceOf(Object);
			expect(commission).to.have.all.keys('commission_number', 'commission_type');
			expect(name).to.be.a('string');
			expect(createdAt).to.be.an.instanceOf(Date);

			const { commission_number, commission_type } = commission;
			expect(commission_number).to.be.a('number');
			expect(commission_type).to.be.a('string');
		});
	});

	it('should call filterPublishersIdByCommissionsType', async() => {
		publishersId = await publishersAnalyticsService.filterPublishersIdByCommissionsType(publishers);
		expect(publishersId).to.be.a('array', 'publishersId is not array');

		publishers.forEach(id => {
			expect(id).to.an.instanceOf(Object);
		});
	});
	
	it('should call getPublishersReportsRevenue', async() => {
		const params = { datesRange: createAtPubsRange, publishersId };
		pubsRepotrsRev = await publishersAnalyticsService.getPublishersReportsRevenue(params);
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
		dateIntervalsArr = publishersAnalyticsService.getDateIntervals(params);
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

	it('should call changePubsObj', () => {
    correctPubsObj = publishersAnalyticsService.changePubsObj(publishers);
		expect(correctPubsObj).to.be.a('array');

		correctPubsObj.forEach(publisher => {
			expect(publisher).to.be.instanceOf(Object);

			const { _id, name, created_at } = publisher;
			expect(_id).to.be.an.instanceOf(Object);
			expect(name).to.be.a('string');
			expect(created_at).to.be.an.instanceOf(Date);
		});
	});

	it('should call setPubsAnalytics', async() => {
		updatedPubs = await publishersAnalyticsService.setPubsAnalytics({ publishers: correctPubsObj, pubsRepotrsRev, dateIntervalsArr });

		updatedPubs.forEach(publisher => {
			expect(publisher).to.be.instanceOf(Object);

			const { _id, name, created_at, analytics } = publisher;
			expect(_id).to.be.an.instanceOf(Object);
			expect(name).to.be.a('string');
			expect(created_at).to.be.an.instanceOf(Date);
			expect(analytics).to.be.a('array');
			
			analytics.forEach(obj => {
				expect(obj).to.be.instanceOf(Object);
				expect(obj.date).to.be.a('string');
				expect(obj.revenue).to.be.a('string');
			});

			expect(analytics).to.have.lengthOf(dateIntervalsArr.length);
		});
	});
});