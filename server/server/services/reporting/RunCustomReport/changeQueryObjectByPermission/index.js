const { REPORT_FILTERS } = require('../../../../constants/reportFilters');

exports.changeQueryObjectByPermission = (
    { queryObject: query, permission, userTokenId },
    usersByCommissionType
) => {
    // console.log(permission);
    const queryObjects = [];

    Object.keys(usersByCommissionType).forEach(key => {
        const allowed = usersByCommissionType[key];
        const publishers = usersByCommissionType[key]['publishersWithName'];
        const managers = usersByCommissionType[key]['managersWithName'];
        // cloning the query object to avoid any references
        const currentQuery = JSON.parse( JSON.stringify( query ) );

        const permissionMethods = {
            // permission methods might change in the future
            canReadAllReports(queryObject) {
                return filterOutDisallowed(queryObject, allowed);
            },
            canReadAllPubsReports(queryObject) {
                return filterOutDisallowed(queryObject, allowed);
            },
            canReadOwnPubsReports(queryObject) {
                return filterOutDisallowed(queryObject, allowed);
            },
            canReadOwnReports(queryObject) {
                const allowedDimensions = [ 'size', 'inventoryType', 'domain', 'placement', 'daily', 'monthly' ];
                const allowedFilters = [ 
                    REPORT_FILTERS.SIZES, 
                    REPORT_FILTERS.DOMAINS, 
                    REPORT_FILTERS.INVENTORY_TYPE, 
                    REPORT_FILTERS.PUBLISHERS, 
                    REPORT_FILTERS.PLACEMENTS, 
                    REPORT_FILTERS.MANAGERS
                ];
                const filteredOut = filterOutDisallowed(queryObject, allowed);

                filteredOut.dimensions = filteredOut.dimensions.filter(value => allowedDimensions.includes(value));
                filteredOut.filters = filteredOut.filters.filter(value => allowedFilters.includes(value.filterId));

                return filteredOut;
            }
        };

        queryObjects.push({ query: permissionMethods[permission](currentQuery), commissionType: key, publishers, managers});
    });

    return queryObjects;

};

function filterOutDisallowed(queryObject, { 
    domains: allowedDomains, 
    properties: allowedProperties, 
    publishers: allowedPublishers, 
    placements: allowedPlacements, 
    managers: allowedManagers
}) {
    const propertiesFilterId = REPORT_FILTERS.PROPERTIES;
    const placementsFilterId = REPORT_FILTERS.PLACEMENTS;
    const domainsFilterId = REPORT_FILTERS.DOMAINS;
    const publishersFilterId = REPORT_FILTERS.PUBLISHERS;
    const managersFilterId = REPORT_FILTERS.MANAGERS;

    // extracting every affected filter into a separate object
    const [ properties ] = queryObject.filters.filter(filter => filter.filterId === propertiesFilterId);
    const [ domains ] = queryObject.filters.filter(filter => filter.filterId === domainsFilterId);
    const [ publishers ] = queryObject.filters.filter(filter => filter.filterId === publishersFilterId);
    const [ placements ] = queryObject.filters.filter(filter => filter.filterId === placementsFilterId);
    const [ managers ] = queryObject.filters.filter(filter => filter.filterId === managersFilterId);

    queryObject.filters.forEach((filter, index) => {
        if(filter.filterId === propertiesFilterId) {
            const filteredOut = properties.values.filter(value => allowedProperties.includes(value));
            if (properties.type === 'exclude') {
                queryObject.filters[index].values = allowedProperties.filter(value => !filteredOut.includes(value));
                queryObject.filters[index].type = 'include';
            } else {
                queryObject.filters[index].values = filteredOut;
            }
        } else if (filter.filterId === domainsFilterId) {
            const filteredOut = domains.values.filter(value => allowedDomains.includes(value));
            if (domains.type === 'exclude') {
                queryObject.filters[index].values = allowedDomains.filter(value => !filteredOut.includes(value));
                queryObject.filters[index].type = 'include';
            } else {
                queryObject.filters[index].values = filteredOut;
            }
        } else if (filter.filterId === publishersFilterId) {
            const filteredOut = publishers.values.filter(value => allowedPublishers.includes(value));

            if (publishers.type === 'exclude') {
                queryObject.filters[index].values = allowedPublishers.filter(value => !filteredOut.includes(value));
                queryObject.filters[index].type = 'include';
            } else {
                queryObject.filters[index].values = filteredOut;
            }
        } else if (filter.filterId === placementsFilterId) {
            const filteredOut = placements.values.filter(value => allowedPlacements.includes(value));

            if (placements.type === 'exclude') {
                queryObject.filters[index].values = allowedPlacements.filter(value => !filteredOut.includes(value));
                queryObject.filters[index].type = 'include';
            } else {
                queryObject.filters[index].values = filteredOut;
            }

        } else if (filter.filterId === managersFilterId) {
            const filteredOut = managers.values.filter(value => allowedManagers.includes(value));
            if (managers.type === 'exclude') {
                queryObject.filters[index].values = allowedManagers.filter(value => !filteredOut.includes(value));
                queryObject.filters[index].type = 'include';
            } else {
                queryObject.filters[index].values = filteredOut;
            }
        }
    });

    if (!queryObject.filters.some(filter => publishersFilterId === filter.filterId)) {
        queryObject.filters.push({
            filterId :REPORT_FILTERS.PUBLISHERS,
            values: allowedPublishers,
            type:'include'
        })
    }

    if (!queryObject.filters.some(filter => domainsFilterId === filter.filterId)) {
        queryObject.filters.push({
            filterId :REPORT_FILTERS.DOMAINS,
            values: allowedDomains,
            type:'include'
        })
    }

    if (!queryObject.filters.some(filter => propertiesFilterId === filter.filterId)) {
        queryObject.filters.push({
            filterId :REPORT_FILTERS.PROPERTIES,
            values: allowedProperties,
            type:'include'
        })
    }

    
    if (!queryObject.filters.some(filter => managersFilterId === filter.filterId)) {
        queryObject.filters.push({
            filterId :REPORT_FILTERS.MANAGERS,
            values: allowedManagers,
            type:'include'
        })
    }

    // if (!queryObject.filters.some(filter => placementGroupFilterId === filter.filterId)) {
    //     queryObject.filters.push({
    //         filterId :REPORT_FILTERS.PLACEMENTS,
    //         values: allowedPlacementGroups,
    //         type:'include'
    //     })
    //
    // }
    return queryObject;
}

