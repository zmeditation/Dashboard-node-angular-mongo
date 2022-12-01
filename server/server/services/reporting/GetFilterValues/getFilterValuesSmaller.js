const mongoose = require('mongoose');
const Reports = mongoose.model('Reports');
const User = mongoose.model('User');
const { REPORT_FILTERS } = require('../../../constants/reportFilters');
const { DomainModel } = require('../../../database/mongoDB/migrations/domainsModel/index');
const PropertyModel = require('../../../database/mongoDB/migrations/propertyModel');
const array = require('../../../modules/utilities/array/sorting');
const GetValues = require('../GetOrigins/GetOrigins');
const { getInventorySizes } = require('./FilterFunctions/GetReportsSizes/getReportsSizes-Performers');


exports.canReadAllReports = (filterId, userTokenId) => {
    return new Promise(async resolve => {
        const isPub = false;
        const queries = {
            reportsQuery: {'property.refs_to_user': {$exists: true, $ne: null}},
            usersQuery: {role: "PUBLISHER"}
        };

        const result = getByFilterId(filterId, isPub, queries, userTokenId);
        resolve(result);
    });
};

exports.canReadAllPubsReports = (filterId, userTokenId) => {
    return new Promise(async resolve => {
        const {idsArray, user} = await findCurrentUser(userTokenId);
        const allPubsID = await findPubsOfAM(idsArray);
        const queryToFind = filterByRole(user, allPubsID);
        const isPub = false;
        const queries = {
            reportsQuery: {'property.refs_to_user': {$exists: true, $ne: null}},
            usersQuery: queryToFind
        };

        const result = getByFilterId(filterId, isPub, queries, userTokenId);

        resolve(result);
    });
};

exports.canReadOwnPubsReports = (filterId, userTokenId) => {
    return new Promise(async resolve => {
        User.findOne({_id: userTokenId}).then(user => {
            const isPub = false;
            const queries = {
                reportsQuery: {'property.refs_to_user': {$in: user.connected_users.p}},
                usersQuery: {role: "PUBLISHER", am: userTokenId}
            };

            const result = getByFilterId(filterId, isPub, queries, userTokenId);

            resolve(result);
        });
    })
};

exports.canReadOwnReports = (filterId, userTokenId) => {
    return new Promise(async resolve => {
        const isPub = true;
        const queries = {
            reportsQuery: {'property.refs_to_user': userTokenId},
            usersQuery: {role: "PUBLISHER", _id: userTokenId}
        };

        const result = getByFilterId(filterId, isPub, queries, userTokenId);

        resolve(result);
    })
};

async function findCurrentUser(userTokenId) {
    const user = await User.find({_id: userTokenId})
        .sort({name: 1})
    const idsArray = [];
    idsArray.push(user[0]._id);
    user[0].connected_users.am.forEach(el => {
        idsArray.push(el);
    });
    user[0].connected_users.p.forEach(el => {
        idsArray.push(el);
    });
    return {
        idsArray,
        user: user[0]
    };
}

async function findPubsOfAM(arr) {
    const allPubsID = [];
    for (const id of arr) {
        const currentUser = await User.find({_id: id});
        if (currentUser.length && currentUser[0].role === 'ACCOUNT MANAGER') {
            currentUser[0].connected_users.p.forEach(el => {
                allPubsID.push(el);
            })
        } else if (currentUser.length && currentUser[0].role === 'PUBLISHER') {
            allPubsID.push(currentUser[0]._id);
        }
    }
    return allPubsID;
}

function filterByRole(user, idsAllPubs) {
    let queryToFind;
    if (user.role === "CEO MANAGE" || user.role === "CEO") {
        queryToFind = {
            role: "PUBLISHER"
        }
    } else {
        queryToFind = user.role !== 'AD OPS' && user.role !== 'MEDIA BUYER' &&
            user.role !== 'SENIOR ACCOUNT MANAGER' ?
            {
                role: "PUBLISHER",
                _id: {$in: idsAllPubs}
            } : {
                role: "PUBLISHER"
            };
    }
    return queryToFind;
}

async function getByFilterId(filterId, isPub, queries, userTokenId) {
    let result;
    switch (filterId) {
        case REPORT_FILTERS.PLACEMENTS:
            result = getPlacements(queries.usersQuery);
            break;
        case REPORT_FILTERS.USER_PROPERTIES:
            if (!isPub) {
                result = getUserProperties(queries.usersQuery);
            } else {
                result = {
                    _id: REPORT_FILTERS.USER_PROPERTIES,
                    name: 'USER_PROPERTIES',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.PROPERTIES:
            if (!isPub) {
                result = getProperties(queries.reportsQuery);
            } else {
                result = {
                    _id: REPORT_FILTERS.PLACEMENTS,
                    name: 'PROPERTIES',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.INVENTORY_TYPE:
            result = getInventoryTypes();
            break;
        case REPORT_FILTERS.SIZES:
            result = await getInventorySizes(userTokenId);
            break;
        case REPORT_FILTERS.PUBLISHERS:
            if (!isPub) {
                result = await getPublishers(queries.usersQuery);
            } else {
                result = {
                    _id: REPORT_FILTERS.PUBLISHERS,
                    name: 'PUBLISHERS',
                    results: []
                }
            }
            break;
        case REPORT_FILTERS.INACTIVE_PUBLISHERS:
            if (!isPub) {
                result = await getInactivePublishers(queries.usersQuery)
            } else {
                result = {
                    _id: 'unknown',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.ALL_PUBLISHERS:
            if (!isPub) {
                result = await getAllPublishers(queries.usersQuery)
            } else {
                result = {
                    _id: 'unknown',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.DOMAINS:
            result = await getDomains(queries.reportsQuery);
            break;
        case REPORT_FILTERS.ORIGIN:
            if (!isPub) {
                result = getOrigins();
            } else {
                result = {
                    _id: 'unknown',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.FOR_ADS_TXT:
            if (!isPub) {
                result = await getOriginsWithDomains(queries.reportsQuery);
            } else {
                result = {
                    _id: 'unknown',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.MANAGERS:
            if (!isPub) {
                result = await getManagers({role: ['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER']});
            } else {
                result = {
                    _id: 'unknown',
                    results: []
                };
            }
            break;
        case REPORT_FILTERS.WBID_PUBLISHERS:
            if (!isPub) {
                result = await getWBidPublishers(queries.usersQuery)
            } else {
                result = {
                    _id: 'unknown',
                    results: []
                };
            }
            break;
        default:
            result = [];
    }

    return result;
}

async function getPlacements(queryObject) {
    const placementAggregation = await User.aggregate([
        {$match: queryObject},
        {
            $group: {
                "_id": "$_id",
                "name": {$first: "$name"},
                "placements": {$addToSet: "$properties.placement_name"}
            }
        }
    ]);

    let filteredOut = placementAggregation
        .map(pub => {
            let set = new Set(pub['placements'][0]);
            const arrayOfUniqueValues = [];
            set.forEach(value => {
                arrayOfUniqueValues.push(value);
            });
            return {
                _id: pub['_id'],
                name: pub['name'],
                placements: arrayOfUniqueValues || []
            }
        })
        .filter(user => user['placements'].length)
        .reduce((acc, user) => {
            return [...acc, ...user['placements']];
        }, []);

    filteredOut = Array.from(new Set(filteredOut)).sort();

    return {
        _id: REPORT_FILTERS.PLACEMENTS,
        name: 'PLACEMENTS',
        results: filteredOut
    }
}

async function getProperties(queryObject) {
    try {

        const propertyObject = {};
        const newQueryObject = {
            refs_to_user: queryObject['property.refs_to_user']
        }

        const categorizedByUsersPromise = PropertyModel.aggregate([
            {$match: newQueryObject},
            {
                $group: {
                    "_id": "$refs_to_user",
                    "domains": {$addToSet: "$domain"}
                }
            },
            {
                $lookup: {
                    "from": "users",
                    "let": {id: "$_id"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$id"]}}},
                        {"$project": {"name": 1, "_id": 0}}
                    ],
                    "as": "name"
                }
            }
        ]);

        const categorizedByDomainsPromise = PropertyModel.aggregate([
            {$match: newQueryObject},
            {
                $group: {
                    "_id": "$domain",
                    "properties": {$addToSet: "$property_id"}
                }
            }
        ]);

        const [categorizedByUsers, categorizedByDomains] = await Promise.all([categorizedByUsersPromise, categorizedByDomainsPromise]);

        for (const user of categorizedByUsers) {
            user['name'] = user['name'].map(name => name.name);
        }

        categorizedByDomains.forEach(domain => {
            if (domain._id) {
                propertyObject[domain._id] = domain.properties;
            }
        });

        const properties = categorizedByUsers.map(result => {

            result.domains = result.domains.map(domain => {
                return {
                    domain: domain,
                    properties: propertyObject[domain]
                }
            });

            return {
                _id: result._id,
                name: result.name[0],
                domains: result.domains
            }
        });

        return {_id: REPORT_FILTERS.PROPERTIES, name: 'PROPERTIES', results: array.sortBy(properties, {prop: "name"})};

    } catch (e) {
        console.error(e);
    }
}

async function getUserProperties(queryObject) {
    try {
        let users = await User.find(queryObject, 'name domains properties').lean();
        let domains = await DomainModel.find({ enabled: true }, 'domain refs_to_user').lean().then(res => {
            return res.map(el => {
                el.refs_to_user = el.refs_to_user.map(i => i.toString());
                return el;
            });
        });
        // let users = await Property.aggregate([
        //     { $match: { refs_to_user: { $ne: null } } },
        //     { $group: {
        //         _id: "$refs_to_user",
        //         domains: { $addToSet: "$domain" },
        //         properties: { $addToSet: { property_id: "$property_id", property_origin: { $toLower: "$property_origin" } } },
        //         programmatics: { $addToSet: "$property_origin" }
        //     } },
        //     { $lookup: {
        //         "from": "users",
        //         "let": { id: "$_id", name: "$name" },
        //         "pipeline": [
        //             { "$match": { "$expr": { "$eq": [ "$_id", "$$id" ] } } },
        //             { "$project": { "name": 1, "_id": 1 }}
        //         ],
        //         "as": "publisher"
        //     } }
        // ]).then(el => {
        //     el.forEach(i => {
        //         i.name = i.publisher[0].name;
        //     })
        //     return el;
        // })
        return {
            _id: REPORT_FILTERS.USER_PROPERTIES,
            name: 'USER_PROPERTIES',
            // results: users
            results: users.map(user => {

                user.domains = [];

                domains.forEach(domain => {
                    if (domain.refs_to_user.includes(user._id.toString()) && !user.domains.includes(domain.domain)) {
                        user.domains.push(domain.domain);
                    };
                })
                return {
                    name: user.name,
                    _id: user._id,
                    domains: user.domains,
                    programmatics: Array.from(new Set(user.properties.map(prop => prop.property_origin))),
                    properties: user.properties.reduce((acc, prop) => {
                        if (!acc[prop.property_origin]) {
                            acc[prop.property_origin] = [];
                        }
                        if (!acc[prop.property_origin].includes(prop.property_id)) {
                            acc[prop.property_origin].push(prop.property_id);
                        }
                        // acc[prop.property_origin] = acc[prop.property_origin] && !acc[prop.property_origin].includes(prop.property_id) ? [...acc[prop.property_origin], prop.property_id] : [prop.property_id];
                        return acc;
                    }, {})
                };
            })
        }

    } catch (e) {
        console.error(e);
    }
}

async function getOriginsWithDomains(queryObject) {
    try {
        const propertyObject = {};
        const categorizedByUsersPromise = await Reports.aggregate([
            {$match: queryObject},
            {
                $group: {
                    "_id": "$property.refs_to_user",
                    "domains": {$addToSet: "$property.domain"}
                }
            },
            {
                $lookup: {
                    "from": "users",
                    "let": {id: "$_id", enabled: "$enabled.status"},
                    "pipeline": [
                        {"$match": {"$expr": {"$eq": ["$_id", "$$id"]}}},
                        {"$project": {"name": 1, "am": 1, "enabled": 1, "_id": 0}}
                    ],
                    "as": "name"
                }
            }
        ]);
        const categorizedByDomainsPromise = Reports.aggregate([
            {$match: queryObject},
            {
                $group: {
                    "_id": "$property.domain",
                    "origins": {$addToSet: {$toLower: "$report_origin"}}
                }
            }
        ]);

        const [categorizedByUsers, categorizedByDomains] = await Promise.all([categorizedByUsersPromise, categorizedByDomainsPromise]);

        // for (const user of categorizedByUsers) {
        //     user['name'] = user['name'].map(name => name.name);
        // }

        categorizedByDomains.forEach(domain => {
            if (domain._id) {
                propertyObject[domain._id] = domain.origins;
            }
        });

        const properties = categorizedByUsers.map(result => {
            result.domains = result.domains.map(domain => {
                if (propertyObject[domain].includes('google ad manager')) {
                    propertyObject[domain].push('EBDA');
                }
                return {
                    domain: domain,
                    origins: propertyObject[domain]
                }
            });
            return {
                _id: result._id,
                name: result.name.length ? result.name[0].name : 'no name',
                am: result.name.length ? result.name[0].am : 'no manager',
                domains: result.domains,
                enabled: result.name.length ? result.name[0].enabled : 'not enabled'
            }
        });
        return {results: array.sortBy(properties, {prop: "name"})};

    } catch (e) {
        console.error(e);
    }
}

function getInventoryTypes() {
    return {
        _id: REPORT_FILTERS.INVENTORY_TYPE,
        name: 'INVENTORY_TYPES',
        results: ['banner', 'video', 'modernAdaptive']
    }
}

// Do not delete, just comment
// function getInventorySizes() {
//     return {
//         _id: REPORT_FILTERS.SIZES,
//         name: 'SIZES',
//         results: [
//             'Native', '-', 'vertical', 'unknown', 'modernAdaptive', 'extensibleMobile', 'Video/Overlay',
//             'Inpage', '88x31', '120x20', '120x30', '120x60', '120x90', '120x240', '120x600', '125x125', '160x600',
//             '168x28', '168x42', '180x150', '200x200', '200x446', '216x36', '216x54', '220x90', '234x60', '240x133', '240x400',
//             '250x250', '250x350', '250x360', '250x400', '292x30', '300x31', '300x50', '300x75', '300x100', '300x250', '300x450',
//             '300x600', '300x1050', '320x50', '320x100', '320x480', '336x280', '468x60', '480x320', '580x250', '580x400', '728x90',
//             '750x100', '750x200', '750x300', '768x1024', '930x180', '950x90', '960x90', '970x66', '970x90', '970x250', '980x90',
//             '980x120', '1024x768', '1060x90', '970x200', '640x480', '640x400',
//             '580x450', '512x288', '430x288', '300x300', '1x1', '1x0', '2x0', '3x0', '4x0'
//         ]
//     }
// }

async function getPublishers(queryObject) {
    try {
        const additionQrObj = { ...queryObject, 'enabled.status': true };

        // let [ results ] = await User.aggregate([
        //     { $match: additionQrObj },
        //     { $group: {
        //         "_id": REPORT_FILTERS.PUBLISHERS,
        //         "results": {
        //             $addToSet: {
        //                 "name": "$name",
        //                 "id": "$_id",
        //                 "domains": "$domains",
        //                 "enabled": "$enabled.status"
        //             }
        //         }
        //     }}
        // ]);

        let usersIds = await User.find(additionQrObj, { _id: true })
            .lean().distinct('_id');

        let results = await DomainModel.find({
            refs_to_user: {
                $in: usersIds
            },
            enabled: true,
            approved: true
        }, {
            _id: false,
            last_modify: false,
            ortb: false,
            createdAt: false,
            updatedAt: false
        }).populate({ path: "refs_to_user", select: 'name enabled _id' }).lean().then(res => {
            const output = usersIds.map(el => {
              const obj = {
                id: el,
                domains: []
              };
              res.forEach(i => {
                i.refs_to_user.forEach(u => {
                  u._id = u._id.toString();
                  if (el.toString() === u._id && !obj.domains.includes(i.domain)) {
                    obj.domains.push(i.domain);
                    obj.name = u.name;
                    if (!obj.enabled) {
                      obj.enabled = u.enabled.status;
                    }
                  }
                })
              });
              return obj;
            }).filter(el => !!el.name);
            return {
              id: REPORT_FILTERS.PUBLISHERS,
              results: output
            }
        })

        if (results) {
            results.name = 'PUBLISHERS';
            results.results = array.sortBy(results['results'], {prop: "name"});
        } else {
            results = {
                _id: REPORT_FILTERS.PUBLISHERS,
                name: 'PUBLISHERS',
                results: []
            }
        }
        return results;
    } catch (e) {
        console.error(e);
    }
}

async function getWBidPublishers(queryObject) {
    try {
        queryObject.wbidUserId = {$nin: [null, '']};
        let [results] = await User.aggregate([
            {$match: queryObject},
            {
                $group: {
                    "_id": REPORT_FILTERS.WBID_PUBLISHERS,
                    "results": {
                        $addToSet: {
                            "name": "$name",
                            "id": "$_id",
                            "domains": "$domains",
                            "enabled": "$enabled.status"
                        }
                    }
                }
            }
        ]);

        if (results) {
            results.name = 'PUBLISHERS';
            results.results = array.sortBy(results['results'], {prop: "name"});
        } else {
            results = {
                _id: REPORT_FILTERS.WBID_PUBLISHERS,
                name: 'PUBLISHERS',
                results: []
            }
        }
        return results;
    } catch (e) {
        console.error(e);
    }
}

async function getManagers() {
    try {
        let results;
        const accountManagersAndPubs = await User.find({
            role: {
                $in: ['ACCOUNT MANAGER', 'SENIOR ACCOUNT MANAGER', 'PUBLISHER']
            },
            "enabled.status": true
        })
            .populate({path: 'connected_users.p', select: 'name _id photo enabled date_to_connect_am'})
            .populate({path: 'am', select: 'name _id'});

        if (!accountManagersAndPubs.length) {
            throw new ServerError('MISSING_ACCOUNT_MANAGERS', 'BAD_REQUEST');
        }

        const accountManagers = accountManagersAndPubs
            .filter(am => am['role'] === 'ACCOUNT MANAGER' || am['role'] === 'SENIOR ACCOUNT MANAGER')
            .map(am => {
                return {
                    _id: am._id,
                    manager: am.name,
                    publishers: am['connected_users']['p'],
                    photo: am['photo'] ? am['photo'] : null
                }
            });

        const pubsWithoutManager = {
            _id: null,
            manager: 'No manager',
            photo: null,
            publishers: accountManagersAndPubs
                .filter(pub => pub['role'] === 'PUBLISHER' && pub['am'] === null)
                .map(pub => {
                    return {
                        _id: pub._id,
                        name: pub.name,
                        enabled: pub.enabled
                    }
                })
        };
        accountManagers.push(pubsWithoutManager);

        if (accountManagersAndPubs) {
            results = {
                _id: REPORT_FILTERS.MANAGERS,
                name: 'MANAGERS',
                results: array.sortBy(accountManagers, {prop: "name"})
            }
        } else {
            results = {
                _id: REPORT_FILTERS.MANAGERS,
                name: 'MANAGERS',
                results: []
            }
        }
        return results;
    } catch (e) {
        console.error(e);
    }
}

async function getDomains(queryObject) {
    try {
      let query = { refs_to_user: queryObject['property.refs_to_user'] }
      let domainsList = await DomainModel.find(query).distinct('domain');
      let results = {
        _id: REPORT_FILTERS.DOMAINS,
        name: 'DOMAINS',
        results: []
      };
      if (domainsList) {
        results._id = REPORT_FILTERS.DOMAINS;
        results.name = 'DOMAINS';
        results.results = domainsList.sort();
      }
      return results;
    } catch (e) {
        console.error(e);
    }
}

async function getOrigins() {
    const GetFiltredValues = new GetValues();
    const origins = await GetFiltredValues.execute(REPORT_FILTERS.ORIGIN);
    return {
        _id: REPORT_FILTERS.ORIGIN,
        name: 'ORIGINS',
        results: origins.origins
    }
}

async function getInactivePublishers(queryObject) {
    try {
        const additionQrObj = { ...queryObject, 'enabled.status': false };

        let [ results ] = await User.aggregate([
            { $match: additionQrObj },
            { $group: { "_id": REPORT_FILTERS.INACTIVE_PUBLISHERS, "results": { $addToSet : { "name": "$name", "id": "$_id", "domains": "$domains", "enabled": "$enabled.status" }}}},
        ]);

        if (results) {
            results.name = 'PUBLISHERS';
            results.results = array.sortBy(results['results'], {prop: "name"});
        } else {
            results = {
                _id: REPORT_FILTERS.INACTIVE_PUBLISHERS,
                name: 'PUBLISHERS',
                results: []
            }
        }
        return results;
    } catch (e) {
        console.error(e);
    }
}

async function getAllPublishers(queryObject) {
    try {
        let [ results ] = await User.aggregate([
            { $match: queryObject },
            { $group: { "_id": REPORT_FILTERS.ALL_PUBLISHERS, "results": { $addToSet : { "name": "$name", "id": "$_id", "enabled": "$enabled.status" }}}},
        ]);
        if (results) {
            results.name = 'PUBLISHERS';
            results.results = array.sortBy(results['results'], {prop: "name"});
        } else {
            results = {
                _id: REPORT_FILTERS.ALL_PUBLISHERS,
                name: 'PUBLISHERS',
                results: []
            }
        }
        return results;
    } catch (e) {
        console.error(e);
    }
}
