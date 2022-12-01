const { truncateSync } = require('fs-extra');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationsModel = new Schema({

    refs_to_user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User id is required']
    },

    msgType: {
        type: String,
        required: [true, 'Type of message is required'],
        trim: true,
    },

    msg: {
        type: Object,
        required: true,
        text: String,
        event: {
            type: String,
            default: '',
            require: true
        },
        trigger: String,
        typeMsg: String,
        success: Boolean,
        file: String,
        action: String,
        pub: String,
        cancelReason: String,
        publisher: String
    },

    isWatched: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
}
);
const Notifications = mongoose.model('Notifications', NotificationsModel);
module.exports = Notifications;
