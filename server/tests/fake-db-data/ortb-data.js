module.exports = {
    body: {
        request: {
            type: 'oRTB',
            range: 'lastSevenDays',
            interval: 'total',
            enumerate: true,
            fillMissing: true,
            enableExport: true,
            customRange: {"dateFrom": "", "dateTo": ""},
            metrics: ["dsp_requests", "ssp_requests", "dsp_response", "ssp_responses", "impression", "view", "click", "revenue_imp"],
            filters: [],
            dimensions: []
        },
        additional: {
            id: '5fd9dc21af4ae2d75536f7d6',
            wbidUserId: null,
            permission: 'canReadAllOrtbReports',
            permissions: ['canReadAllOrtbReports'],
            photo: '6cf2f768-a016-4c12-990b-c075fa73272a.png',
            name: 'admin-laslo'
        }
    }
}
