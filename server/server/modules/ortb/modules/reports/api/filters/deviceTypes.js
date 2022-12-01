const devices = [
    {name: "mobile/tablet", value: "1"},
    {name: "desktop", value: "2"},
    {name: "TV", value: "3"},
    {name: "mobile", value: "4"},
    {name: "tablet", value: "5"},
    {name: "connected device", value: "6"},
    {name: "set top box", value: "7"},
    {name: "other", value: "0"}

]

class DevicesTypesList {
    constructor() {
    }

    run() {
        return {
            success: true,
            name: 'DEVICES',
            results: devices,
        }
    }
}

module.exports = DevicesTypesList;
