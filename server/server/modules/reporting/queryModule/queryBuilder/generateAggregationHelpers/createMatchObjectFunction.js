const moment = require('moment');
const mongoose = require('mongoose');
const { REPORT_FILTERS } = require('../../../../../constants/reportFilters');

exports.createMatchObject = (query) => {
    return { $match: { ...generateFilterQuery(query.filters), ...generateDateQuery(query) } };
};

function generateFilterQuery(queryFilters) {
    if (!queryFilters) throw new Error('Invalid Filters');

    const filterTypes = {
        [REPORT_FILTERS.PROPERTIES]: "property.property_id",
        [REPORT_FILTERS.PLACEMENTS]: "property.placement_name",
        [REPORT_FILTERS.INVENTORY_TYPE]: "inventory_type",
        [REPORT_FILTERS.SIZES]: "inventory.sizes",
        [REPORT_FILTERS.PUBLISHERS]: "property.refs_to_user",
        [REPORT_FILTERS.DOMAINS]: "property.domain",
        [REPORT_FILTERS.ORIGIN]: "report_origin",
        [REPORT_FILTERS.MANAGERS]: "property.am"
    };

    const filterObject = {
        "property.refs_to_user": { $exists: true, $ne: null }
    };

    for (const filter of queryFilters) {
        const isInclude = filter.type === 'include';

        if (filter.filterId === REPORT_FILTERS.PUBLISHERS) {
            filter.values = filter.values.map(value => new mongoose.Types.ObjectId(value))
        }
        if (filter.filterId === REPORT_FILTERS.MANAGERS) {
            filter.values = filter.values.map(value => value !== null ? new mongoose.Types.ObjectId(value) : value);
        }

        filterObject[filterTypes[filter.filterId]] = isInclude ? { $in: filter.values } : { $nin: filter.values };
    }

    filterObject["property.refs_to_user"]['$exists'] = true;
    filterObject["property.refs_to_user"]['$ne'] = null;
    // filterObject["property.am"]['$exists'] = true;
    // filterObject["property.am"]['$ne'] = null;

    return filterObject;
}

function generateDateQuery(queryDates) {
    const { range, customRange: { dateFrom, dateTo }} = queryDates;
    const isCustom = range === 'custom';

    if (range === 'custom' && (!dateFrom || !dateTo)) {
        throw new Error('Absent dateFrom or dateTo in custom query');
    }

    const predefinedRanges = {
        yesterday: {
            $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(1, "days").toDate(),
            $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(1, "days").toDate()
        },
        lastThreeDays: {
            $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(3, "days").toDate(),
            $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(1, "days").toDate()
        },
        lastSevenDays: {
            $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(7, "days").toDate(),
            $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(1, "days").toDate()
        },
        lastSixtyDays: {
            $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(60, "days").toDate(),
            $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(1, "days").toDate()
        },
        monthToYesterday: {
            $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).startOf("month").toDate(),
            $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(1, "days").toDate()
        },
        lastMonth: {
            $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(1, "months").startOf("month").toDate(),
            $lte: moment().utcOffset(0).subtract(1, "months").endOf("month").toDate()
        },
        // dayBeforeYesterday: {
        //     $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(2, "days").toDate(),
        //     $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(2, "days").toDate()
        // },
        // threeDays: {
        //     $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(4, "days").toDate(),
        //     $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(2, "days").toDate()
        // },
        // sevenDays: {
        //     $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(8, "days").toDate(),
        //     $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(2, "days").toDate()
        // },
        // sixtyDays: {
        //     $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).subtract(61, "days").toDate(),
        //     $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(2, "days").toDate()
        // },
        // monthToDate: {
        //     $gte: moment().utcOffset(0).set({ hour:0,minute:0,second:0,millisecond:0 }).startOf("month").toDate(),
        //     $lte: moment().utcOffset(0).set({ hour:23,minute:59,second:59,millisecond:0 }).subtract(2, "days").toDate()
        // },
    };
    const customRange = {
        $gte: moment(dateFrom).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 0}).add(1, 'days').toDate(),
        $lte: moment(dateTo).utcOffset(0).set({ hour: 23, minute: 59, second: 59, millisecond: 999}).add(1, 'days').toDate()
        // $gte: moment(dateFrom).utcOffset("+02:00").set({ hour:2,minute:0,second:0,millisecond:0 }).toDate(),
        // $lte: moment(dateTo).utcOffset("+02:00").set({ hour:1,minute:59,second:59,millisecond:0 }).add(1, "days").toDate()
    };

    const result = isCustom ? { ...customRange }: { ...predefinedRanges[range] };

    return {
        day: { ...result }
    };
}