exports.createDimensionsObject = (query) => {
    const dimensionsObject = {
        interval: "total"
    };

    for (const dimension of query.dimensions) {
        switch(dimension) {
            case 'daily':
                dimensionsObject.interval = { $dayOfMonth: "$day" };
                dimensionsObject.month = { $month: "$day"};
                dimensionsObject.year = { $year: "$day" };
                break;
            case 'monthly':
                dimensionsObject.interval = { $month: "$day" };
                dimensionsObject.year = { $year: "$day" };
                break;
            case 'property':
                dimensionsObject.property = "$property.property_id";
                break;
            case 'placement':
                dimensionsObject.placement = "$property.placement_name";
                break;
            case 'publisher':
                dimensionsObject.publisher = "$property.refs_to_user";
                break;
            case 'size':
                dimensionsObject.size = "$inventory.sizes";
                break;
            case 'inventoryType':
                dimensionsObject.inventorytype = "$inventory.inventory_type";
                break;
            case 'domain':
                dimensionsObject.domain = "$property.domain";
                break;
            case 'origin':
                dimensionsObject.origin = "$report_origin";
                break;
            case 'manager':
                dimensionsObject.manager = "$property.am";
            default:
                break;
        }
    }
    
    return dimensionsObject;
};