const { body } = require('express-validator-next');

const MAX_COUNT = 200;
const pageError = 'Page must be a positive integer value.';
const perPageError = `PerPage must be a positive integer value less then ${MAX_COUNT}`;

const rules = [
    body('pagination.perPage').isInt({ lt: MAX_COUNT, gt: 0 }).withMessage(perPageError),
    body('pagination.page').isInt({ gt: 0 }).withMessage(pageError),
];

module.exports = { PaginationValidation: rules };
