const mongoose = require('mongoose');
const {isPublisherExists} = require('./validation/IsActivePublisher');
const {INVOICE_STATUS} = require('./InvoiceStatus');
const Schema = mongoose.Schema;
const methods = require('./methods');

const invoiceSchema = new Schema({
    fileName: {
        type: String,
        trim: true,
        set(value) {
            if (this.isModified('fileName') && this.fileName !== undefined) {
                throw Error('Invoice model, can`t change. You try update fileName field.');
            }
            return value;
        }
    },
    status: {
        type: String,
        enum: Object.values(INVOICE_STATUS),
        trim: true,
        required: true,
        default: INVOICE_STATUS.PENDING
    },
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 400,
        unique: true,
        validate: {
            validator: async function (name) {
                const invoice = await this.constructor.findOne({name});
                if (invoice) {
                    return this.id === invoice.id;
                }
                return true;
            },
        }
    },
    publisher: {
        type: Schema.Types.ObjectId,
        validate: isPublisherExists,
        ref: 'User',
        required: true,
    },
    valid: {
        begin: {
            type: Date,
            required: false,
            default: new Date().toISOString()
        },
        end: {
            type: Date,
            required: false,
            default: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        }
    },
    cancelReason: {
        type: String,
        trim: true,
        required: false,
        maxlength: 1000
    }
}, {timestamps: true, versionKey: false});

invoiceSchema.pre('save', async function (next) {
    if (this.isNew) {
        await this.populate('publisher').execPopulate();
        const name = (this.publisher && this.publisher.name)
            ? this.publisher.name.replace(/ /g, '').substring(0, 7)
            : 'test_pub'
        const date = this.createdAt.toDateString().replace(/ /g, '-');
        const splitted = this.name.split('.')
        this.fileName = `${name}--${date}--${this._id}.${splitted[splitted.length - 1]}`;
        this.depopulate('publisher');
    }

    next();
});

invoiceSchema.methods = methods;

const toObject = invoiceSchema.options.toObject || (invoiceSchema.options.toObject = {});

toObject.transform = function (doc, ret) {
    const {fileName, updatedAt, ...rest} = ret;
    return rest;
};

module.exports = {InvoiceModel: mongoose.model('Invoice', invoiceSchema)};
