const mongoose = require('mongoose');
const { parseToNumber } = require('../../../../services/helperFunctions/numberFunctions');
const Float = require('mongoose-float').loadType(mongoose,4);

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const reportsSchema = new Schema({
    property: {
        domain: {
            type: String,
            lowercase: true,
            trim: true,
        },
        property_id: String,
        placement_name: {
            type: String,
            default: 'Other'
        },
        refs_to_user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            default: null
        },
        am: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            default: null
        }
    },
    commission: {
        commission_number: {
            type: Number,
            default: 0
        },
        commission_type: {
            type: String,
            default: 'eCPM'
        }
    },
    partners_commission: {
        google: {
            total_code_served_count: {
                type: Number
            },
            ad_exchange_impressions: {
                type: Number
            },
            commission_number: {
                type: Number
            },
            commission_type: {
                type: String
            },
            commission_result: {
                type: Number
            }
        }
    },
    day: {
        type: Date,
        default: new Date()
    },
    inventory_sizes: {
        type: String
    },
    inventory_type: {
        type: String
    },
    inventory: {
        sizes: {
            type: String
        },
        width: {
            type: Number,
            set: parseToNumber,
        },
        height: {
            type: Number,
            set: parseToNumber,
        },
        inventory_type: String
    },
    ad_request: {
        type: Number
    },
    matched_request: {
        type: Number
    },
    clicks: {
        type: Number
    },
    ecpm: {
        type: Float
    },
    report_origin: {
        type: String,
        default: 'unknown'
    },
    uploaded_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    viewability: {
        type: Number,
        require: false
    }
});

reportsSchema.index({ 'day': -1 });
reportsSchema.index({ 'property.refs_to_user': 1 });
reportsSchema.index({ 'property.property_id': 1 });
reportsSchema.index({ 'property.am': 1 });
reportsSchema.index({ 'report_origin': 1 });

reportsSchema.plugin(require('mongoose-timestamp'));//Добавляет время добавления записи и время обновления записи

reportsSchema.pre('save', function(next) {
    this.property.property_id = this.property.property_id.replace(/\s+/g, " ").trim();
    next();
});


// reportsSchema.statics.getMonthlyRep = async function (reps, name, gfc) {

//     // console.log(gfc, 'gfc getMonthlyRep');

//     let object = [{
//         _id: name,
//         totalRequests: 0,
//         totalImpressions: 0,
//         averageCPM: 0,
//         revenue: 0,
//         name: name
//     }];

//     const bindedFunc = aggregateByCPMType.bind(this);
//     const bindedGFC = getGFC.bind(this);

//     let result = gfc === true || gfc === 'true' ? await bindedGFC(reps) : await aggregateEvery(reps, object);

//     if (gfc === false || gfc === 'false') {

//         if (result.length > 0) {
//             result = result.reduce((a, b) => {
//                 return {
//                     _id: name,
//                     totalRequests: a['totalRequests'] + b['totalRequests'],
//                     totalImpressions: a['totalImpressions'] + b['totalImpressions'],
//                     averageCPM: a['averageCPM'] + b['averageCPM'],
//                     revenue: a['revenue'] + b['revenue'],
//                     name: name
//                 };
//             }, {
//                 totalRequests: 0,
//                 totalImpressions: 0,
//                 averageCPM: 0,
//                 revenue: 0
//             });

//             result = [ result ];
//         }

//     }

//     if (result.length !== 0) {
//         return result.map(res => {
//             const averageCPM = (res.revenue / res.totalImpressions) * 1000;

//             res.name = name;
//             res.averageCPM = isNaN(averageCPM) ? 0 : averageCPM;

//             return res;
//         });
//     } else {
//         return object;
//     }

//      async function aggregateEvery(usersList, placeholder) {

//         return new Promise((resolve, reject) => {
//             let aggregatedArr = [];
            
//             usersList.forEach(async function (user) {
//                 try {

//                     let  [ aUser ]  = await bindedFunc(user);

//                     if (aUser === undefined) {
//                         [ aUser ] = placeholder;
//                         aggregatedArr.push(aUser);
//                     } else {
//                         aggregatedArr.push(aUser);
//                     }

//                     if (aggregatedArr.length === usersList.length) {
//                         console.log(aggregatedArr);
//                         resolve(aggregatedArr);
//                     }
//                 } catch (e) {
//                     console.error(e);
//                 }

//             });
//         })
//     }


//     async function aggregateByCPMType(aUser) {

//         let { id, commission: { commission_type: commissionType, commission_number: commissionNumber }} = aUser;

//         if (!commissionType || (commissionType !== "eCPM" && commissionType !== "Impressions")) {
//             console.error(`User with the ${id} id has no or a wrong commission type..`);
//             return [];
//         }

//         const result =  await this.aggregate(
//             [
//                 // { $unwind: "$property.refs_to_user" },
//                 { $sort: { "date" : 1, "ad_request": -1, "matched_request": -1 } },
//                 { $match: { "property.refs_to_user": id, day: { $gte: start, $lte: end } } },
//                 {
//                     $group: returnQueryObject(commissionType, commissionNumber)
//                 },
//             ]
//         );

//         return result;

//         function returnQueryObject (userCommissionType) {

//             if (userCommissionType === 'eCPM') {
//                 return {
//                     "_id": `${name}`,
//                     "totalRequests": { $sum: "$ad_request" },
//                     "totalImpressions": { $sum: "$matched_request" },
//                     "averageCPM": { $avg: { $subtract : ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$ecpm"] }]}},
//                     "revenue": { $sum: { $multiply: [{ $divide: ["$matched_request", 1000] }, { $subtract : ['$ecpm', { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$ecpm"] }]}] } }
//                 }
//             } else if (userCommissionType === 'Impressions') {
//                 return {
//                     "_id": `${name}`,
//                     "totalRequests": { $sum: "$ad_request" },
//                     "totalImpressions": { $sum: { $subtract : ["$matched_request", { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$matched_request"] }]} },
//                     "averageCPM": { $avg: "$ecpm" },
//                     "revenue": { $sum: { $multiply: [{ $divide: [{ $subtract : ["$matched_request", { $multiply: [{ $divide: ['$commission.commission_number', 100] }, "$matched_request"] }]}, 1000] }, "$ecpm"] } }
//                 }
//             }
//         }

//     }

//     async function getGFC(userList) {

//         const userIDs = userList.map(user => user.id);

//         return await this.aggregate(
//             [
//                 //{ $unwind: "$property.refs_to_user" },
//                 { $match: { "property.refs_to_user": {$in: userIDs.map(user => new mongoose.Types.ObjectId(user))}, day: { $gte: start, $lte: end } } },
//                 { $sort: { "date" : 1 } },
//                 {
//                     $group: {
//                         "_id": `${name}`,
//                         "totalRequests": { $sum: "$ad_request" },
//                         "totalImpressions": { $sum: "$matched_request" },
//                         "averageCPM": { $avg: "$ecpm" },
//                         "revenue": { $sum: { $multiply: [{ $divide: ["$matched_request", 1000] }, "$ecpm"] } }
//                     }
//                 },
//             ]
//         );

//     }

// };

const ReportModel = mongoose.model('Reports', reportsSchema);
module.exports = ReportModel;
