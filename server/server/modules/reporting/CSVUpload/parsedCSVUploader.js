const mongoose = require('mongoose');
const ReportModel = mongoose.model('Reports');
const Properties = mongoose.model('Property');
const HeaderBiddingService = require('../../../services/reporting/HeaderBiddingService');
const GoogleCommission = require('../partnersCommission/google/googleWMG');
const { SaveUniqueUnits } = require('../../../services/properties/index');

class ParsedCSVUploader {

    constructor() {}

    async pushFullReportToDB(parsedArr, connectedUsers, parserName) {
        SaveUniqueUnits(parsedArr).catch((e) => { console.log(e) });
        const headerBiddingService = new HeaderBiddingService();
        const allHBConfigs = await headerBiddingService.getAllHBConfigs();

        return new Promise (async (resolve, reject) => {
            const uploadedReports = parsedArr.map(async object => {
                try {
                    object.property.domain = headerBiddingService.getDomain(object.property.domain, object.property.property_id);
    
                    const report = new ReportModel(object);

                    const properties = await Properties.findOne({
                        'property_id': object.property.property_id,
                        'property_origin': object.report_origin,
                        'domain': object.property.domain,
                        'refs_to_user': { $ne: null }
                    }, 'property_id refs_to_user domain property_origin placement_name')
                        .populate({
                            path: 'refs_to_user',
                            select: 'commission _id am'
                        }).lean();


                if (properties) {
  
                    let user = properties.refs_to_user;

                    if (
                        allHBConfigs.ids.includes(user._id.toString()) && 
                        allHBConfigs.plcmnt.includes(properties.placement_name) && 
                        properties.property_origin !== 'Google Ad Manager HB'
                    ) {
                      console.log('user has hb');
                      report.ad_request = 0;
                    };

                    report.property.placement_name = properties.placement_name;
                    report.commission = user.commission;
                    report.property.refs_to_user = user._id;
                    report.property.am = user.am;

                    connectedUsers.push(true);
                    return report.save();
                } else {
                    return report.save();
                }
                } catch(e) {
                    reject(e);
                }
            });

            await Promise.all([...uploadedReports]).then(result => {
                resolve('The reports were uploaded.');
            }).catch(e => {
                reject(e);
            })

        });
    }

    pushReportChunksToDB(parsedArr, connectedUsers, parserName) {
        const headerBiddingService = new HeaderBiddingService();
        const currentOrigin = parsedArr[0].report_origin;

        return new Promise(async (resolve, reject) => {

            const length = parsedArr.length;
            const divider = Math.floor(length / 2000);
            let chunk = Math.floor(length / divider);
            let start = 0;
            let end = chunk + start;

            const arrays = {
                arrayToUpload: [],
                arrayOfObjects: [],
                arrayPropsUniqueStrings: []
            };

            const allHBConfigs = await headerBiddingService.getAllHBConfigs();

            const allProperties = await Properties.find({
                    'property_origin': currentOrigin,
                    'refs_to_user': { $ne: null }
                }, 'property_id refs_to_user domain property_origin placement_name'
            ).populate({
                path: 'refs_to_user',
                select: 'commission _id am'
            }).lean().then(res => {
                return res.map(el => {
                    el.uniqueString = el.property_id + el.domain;
                    if (!arrays.arrayPropsUniqueStrings.includes(el.uniqueString)) {
                        arrays.arrayPropsUniqueStrings.push(el.uniqueString);
                    }
                    return el;
                })
            });

            try {
                parseChunk();
            } catch (e) {
                reject(e);
            }

            resolve('The Upload Process was Started!');

            async function parseChunk() {
                console.log('parseChunk -', start);
                try {
                    if (parsedArr[start] !== undefined) {
                        for (let i = start; i < end; i++) {
                            if (!parsedArr[i]) {
                                continue;
                            }
                            if (i > length) {
                                start = chunk + start;
                                end = end + chunk;
                                break;
                            } else {

                                parsedArr[i].property.domain = headerBiddingService.getDomain(parsedArr[i].property.domain, parsedArr[i].property.property_id);

                                arrays.arrayOfObjects.push(parsedArr[i]);
                            }

                        }
                        await SaveUniqueUnits(arrays.arrayOfObjects).then(async s => {
                            await s;
                            console.log(s);
                            console.log('Reports', arrays.arrayOfObjects.length);

                            arrays.arrayOfObjects.forEach(async (report, index) => {

                              const uniqueStringRep = report.property.property_id + report.property.domain;

                              if (arrays.arrayPropsUniqueStrings.includes(uniqueStringRep)) {
                                  for (let item of allProperties) {
                                    if (item.uniqueString === uniqueStringRep) {

                                        if (
                                            allHBConfigs.ids.includes(item.refs_to_user._id.toString()) && 
                                            allHBConfigs.plcmnt.includes(item.placement_name) && 
                                            item.property_origin !== 'Google Ad Manager HB'
                                        ) {
                                            console.log('User with HB');
                                            report.ad_request = 0;
                                        };
                                        report.property.placement_name = item.placement_name;
                                        report.property.refs_to_user = item.refs_to_user._id;
                                        report.property.am = item.refs_to_user.am;
                                        report.commission = item.refs_to_user.commission;
                                        break;
                                    };
                                };

                                connectedUsers.push(true);
                                arrays.arrayToUpload.push(report);
                              } else {
                                arrays.arrayToUpload.push(report);
                              }
                            });
                            await ReportModel.create(arrays.arrayToUpload).then(r => {
                                console.log('saved reports');
                                arrays.arrayToUpload = [];
                                arrays.arrayOfObjects = [];

                                start = chunk + start;
                                end = end + chunk;
                                parseChunk();

                            })
                        });
                    }
                } catch (e) {
                    reject(e);
                }
            }
        });

    }

    parseCommissionObjects(parsedArr) {
        const GoogleCommissionUpdate = new GoogleCommission();
        return new Promise(async (resolve, reject) => {
            try {
                const reports = await ReportModel.find({
                    day: { $in: [parsedArr[0].day] },
                    report_origin: { $in: [
                      "Google Ad Manager"
                    ] }
                  });
                const finalArray = parsedArr.map(async obj => {
                    return await GoogleCommissionUpdate.updateObject(obj, reports);
                });
                await Promise.all([...finalArray]).then(result => {
                    resolve('The reports were uploaded.');
                }).catch(e => {
                    reject(e);
                })
            } catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = ParsedCSVUploader;
