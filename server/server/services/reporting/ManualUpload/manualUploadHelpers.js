const mongoose = require('mongoose');
const ReportModel = mongoose.model('Reports');
const User = mongoose.model('User');
const HeaderBiddingService = require('../HeaderBiddingService');
const { getInventory } = require('../helperFunctions/getInventory');

exports.processManualReports = async (reportsObject, permission, userTokenId) => {
    const reportPromises = [];
    const foundUsers = [];
    const limit = 30;
    const headerBiddingService = new HeaderBiddingService();

    for (let report of reportsObject) {
        report.property.domain = headerBiddingService.getDomain(report.property.domain, report.property.property_id);

        const userQuery = generateQuery(permission, userTokenId, report);

        const user = await User.findOne(userQuery);

        if (user) {
            foundUsers.push(user);
            report.property.am = user.am;
            const object = createReportObject(report, userTokenId);

            const rep = new ReportModel(object);

            // Setting requests to 0 if user has HB
            const propertyIds = user.properties.filter(prop => prop.property_origin === 'Google Ad Manager HB').map(prop => prop.property_id);
            const matches = headerBiddingService.getMatches(propertyIds);

            if (matches.length && rep.inventory_type === 'banner') {
                console.log('user has hb');
                report.ad_request = 0;
                // rep.ad_request = headerBiddingService.getRandomRequestByRandomFillRate(rep.matched_request, 25);
            }

            if (headerBiddingService.isMutka(rep.property.property_id, rep.report_origin)) {
                console.log('user has hb vb');
                report.ad_request = 0;
                // rep.ad_request = headerBiddingService.getRandomRequestByRandomFillRate(rep.matched_request, 25);
            }

            // end of experimental function

            const [ propertyObject ] = user.properties.filter(prop => prop['property_id'] === rep.property.property_id &&  prop['property_origin'] === rep.report_origin);

            if (propertyObject && propertyObject.placement_name) {
                rep.property.placement_name = propertyObject.placement_name;
            }

            rep.commission = user.commission;

            reportPromises.push(rep.save());
        }

    }

    try {
        const reportResults = await Promise.all(reportPromises);
        const uploadedReportIds = reportResults.map(report => report._id);
        updateUploadedReportsList(uploadedReportIds, userTokenId, limit);
        return renderMessage(foundUsers, reportsObject);
    } catch(e) {
        console.error(e);
        return { message: null };
    }

};

async function updateUploadedReportsList(reportIds, userTokenId, limit) {
    try {
        let { previouslyUploadedReports } = await User.findOne({ _id: userTokenId });

        previouslyUploadedReports = Array.isArray(previouslyUploadedReports) ? previouslyUploadedReports : [];

        previouslyUploadedReports = updateUploadList(previouslyUploadedReports, reportIds, limit);

        await User.updateOne({ _id: userTokenId }, { previouslyUploadedReports })
    } catch(e) {
        console.error(e);
    }
}

function updateUploadList(previous, current, limit) {
    const previousLength = previous.length;
    const currentLength = current.length;

    let newList = [];

    if (previousLength + currentLength < limit) {
        newList = [...current, ...previous];
    } else {
        const slicedReports = previous.slice(0, limit - current.length);
        newList = [...current, ...slicedReports];
    }

    return newList;
}

function generateQuery(permission, userTokenId, report) {
    switch (permission) {
        case 'canAddReports':
            return {
                _id: report.property.refs_to_user,
                // properties: {
                //     $elemMatch: {
                //         ['property_id'] : report.property.property_id,
                //         ['property_origin'] : report.report_origin
                //     }
                // },
                // ['domains']: report.property.domain,
            };
            break;
        case 'canAddOwnPubsReports':
            return {
                _id: report.property.refs_to_user,
                // properties: {
                //     $elemMatch: {
                //         ['property_id'] : report.property.property_id,
                //         ['property_origin'] : report.report_origin
                //     }
                // },
              //  ['domains']: report.property.domain,
                am: userTokenId
            };
            break;
        default:
            return {
                _id: report.property.refs_to_user,
                // properties: {
                //     $elemMatch: {
                //         ['property_id'] : report.property.property_id,
                //         ['property_origin'] : report.report_origin
                //     }
                // },
              //  ['domains']: report.property.domain,
                am: userTokenId
            };
    }
}

function renderMessage (foundUsersList, reportsObject) {
    return `${foundUsersList.length} out of ${reportsObject.length} reports ${foundUsersList.length > 1 ? 'were' : 'was'} updated!`;
}

function createReportObject (bodyObject, userTokenId) {
    const writeInvObj = {
        inventory_sizes: bodyObject.inventory.sizes,
        inventory_type: bodyObject.inventory.inventory_type
    };

    return {
        property: {
            domain: getReportName(bodyObject.property.domain),
            property_id: bodyObject.property.property_id,
            refs_to_user: bodyObject.property.refs_to_user,
            am: bodyObject.property.am
        },
        inventory: getInventory(writeInvObj),
        clicks: parseInt(bodyObject.clicks, 10),
        ad_request: parseInt(bodyObject.ad_request, 10),
        matched_request: parseInt(bodyObject.matched_request, 10),
        day: bodyObject.day,
        ecpm: parseECPM(bodyObject.ecpm),
        report_origin: bodyObject.report_origin,
        uploaded_by: userTokenId
    };

    function parseECPM(ecpm) {
        return typeof ecpm === 'string' && ecpm.includes(',') ? parseFloat(ecpm.replace(',', '.')) : parseFloat(ecpm)
    }

    function getReportName(siteName) {
        let replBegin = siteName.replace(/^(www.|http:\/\/|https:\/\/|)/, '');
        let splitSpace = replBegin.split(/\s/g);
        return splitSpace[0].toLowerCase();
    }
}

