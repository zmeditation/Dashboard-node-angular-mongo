const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

const CommissionReportsSchema = new Schema({
    property: {
        domain: {
            type: String,
            lowercase: true,
            trim: true,
        },
        property_id: String,
        placement_name: {
            type: String
        },
        refs_to_user: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        am: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        }
    },
    commission: {
        commission_number: {
            type: Number
        },
        commission_type: {
            type: String,
        }
    },
    total_code_served_count: {
        type: Number,
        default: 0
    },
    ad_exchange_impressions: {
        type: Number,
        default: 0
    },
    day: {
        type: Date,
        default: new Date()
    },
    invoiced_impressions: {
        type: Number,
        default: 0
    },
    inventory_type: {
        type: String,
        default: 'banner'
    },
    report_origin: {
        type: String,
        default: 'unknown'
    }
});

CommissionReportsSchema.index({ day: -1, 'property.refs_to_user': 1, 'property.property_id': 1, 'property.am': 1 });

CommissionReportsSchema.plugin(require('mongoose-timestamp'));//Добавляет время добавления записи и время обновления записи

CommissionReportsSchema.pre('save', function(next) {
    this.property.property_id = this.property.property_id.replace(/\s+/g, " ").trim();
    next();
});

module.exports = mongoose.model('Commission_Reports', CommissionReportsSchema);






