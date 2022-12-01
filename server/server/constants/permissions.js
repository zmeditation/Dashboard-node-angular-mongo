const PERMISSIONS = {
    REVENUE: {
        SEE: 'canSeeRevenues',
        EDIT: 'canEditRevenues',
        DELETE: 'canDeleteRevenues'
    },
    INVOICES: {
        PAGE: 'canSeeInvoicesPage',
        SEE_ALL: 'canSeeAllInvoices',
        SEE_OWN: 'canSeeOwnInvoices',
        UPLOAD: 'canUploadInvoices',
        EDIT: 'canEditInvoiceStatus',
        DELETE: 'canDeleteInvoices'
    },
    CODES: {
        CREATE: 'canCreateTacCodes'
    }
};

const ALLOWED_PUBLISHER_VIEW_PERMISSIONS = [
    'canReadAllReports',
    'canReadOwnPubsReports',
    'canReadAllPubsReports',
    'canReadOwnReports',
    'canReadAllDeductions',
    'canReadOwnAndAccountDeductions',
    'canReadOwnPublishersDeductions',
    'canReadOwnDeductions',
    'canReadAllUsers',
    'canReadAllPubs',
    'canReadOwnPubs',
    'canReadOwnNotices',
    'canReadPermissions',
    'canReadPreviouslyUploadedReports',
    'canReadWBidAllPubsReports',
    'canReadAllWBidReports',
    'canReadWBidOwnPubsReports',
    'canReadOwnWBidReports',
    'canReadOwnAccountInfo',
    'canSeeInvoicesPage',
    'canSeeAllInvoices',
    'canSeeOwnInvoices',
    'canSeeRevenues',
    'canGetAdUnit',
];

module.exports = {PERMISSIONS, ALLOWED_PUBLISHER_VIEW_PERMISSIONS}
