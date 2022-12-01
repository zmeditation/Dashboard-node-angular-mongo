const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {isPublisherExists} = require('../InvoiceModel/validation/IsActivePublisher');
const {ServerError} = require('../../../../handlers/errorHandlers');
const {ERRORS} = require('../../../../constants/errors');
const ObjectId = Schema.Types.ObjectId;

const revenueSchema = new Schema({
    revenue: {
        type: Number,
        required: true
    },
    revenue_rtb: {
        type: Number,
        required: false,
        default: 0
    },
    deduction: {
        type: Number,
        required: false,
        default: 0
    },
    publisher: {
        type: ObjectId,
        validate: isPublisherExists,
        ref: 'User',
        required: true
    },
    begin: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    }

}, {timestamps: true, versionKey: false});

// check if such revenue exists in DB
revenueSchema.pre('save', async function (next) {
    const model = mongoose.model('Revenue', revenueSchema);
    const check = await model.find({publisher: this.publisher, begin: this.begin, end: this.end});
    if (!check.length) {
        next();
    } else {
        next(new ServerError('ALREADY_EXISTS', ERRORS.CONFLICT));
    }
});

module.exports = {RevenueModel: mongoose.model('Revenue', revenueSchema)};
