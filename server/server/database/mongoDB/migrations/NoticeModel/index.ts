const mongoose = require('mongoose');
const { isTypeExist } = require('./validation/noticeValidate');
const Schema = mongoose.Schema;

const NoticeSchema = new Schema({
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true
    },
    notice_type: {
      type: String,
      trim: true,
      validate: [isTypeExist],
      default: 'information'
    },
    text: {
      type: String,
      maxlength: 1024,
      default: ''
    },
    remove_date: {
      type: Date,
      default: new Date(new Date().setDate(new Date().getDate() + 1))
    },
    target_roles: [
      {
        type: String,
        default: 'ADMIN',
        trim: true
      }
    ],
    target_users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    status: {
      type: Boolean
    }
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false
    },
    versionKey: false
  }
);

NoticeSchema.index({"creator": 1});
NoticeSchema.index({"remove_date": 1});
NoticeSchema.index({"target_users": 1});
NoticeSchema.index({"title": 1});

export const NoticeModel = mongoose.model('Notice', NoticeSchema);
