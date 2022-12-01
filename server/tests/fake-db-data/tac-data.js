module.exports = {
    body: {
        "request": {
            "type": "analytics",
            "range": "lastSevenDays",
            "interval": "total",
            "enumerate": true,
            "fillMissing": true,
            "enableExport": true,
            "customRange": {"dateFrom": "", "dateTo": ""},
            "metrics": ["requests", "impressions", "view", "clicks"],
            "filters": [],
            "dimensions": []
        },
        additional: {
            id: '5fd9dc21af4ae2d75536f7d6',
            wbidUserId: null,
            permission: 'canReadAllTacReports',
            permissions: ['canReadAllTacReports'],
            photo: '6cf2f768-a016-4c12-990b-c075fa73272a.png',
            name: 'admin-laslo'
        }
    },

    url: '/63508'
}
