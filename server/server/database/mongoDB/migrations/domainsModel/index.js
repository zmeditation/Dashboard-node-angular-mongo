const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isValidDomain, isUnique } = require('./validation/domainValidate');

const domainSchema = new Schema({
  domain: {
    type: String,
    required: true,
    trim: true,
    validate: [ isValidDomain, isUnique ],
    unique: true
  },
  refs_to_user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: []
    }
  ],
  approved: {
    type: Boolean,
    default: true
  },
  enabled: {
    type: Boolean,
    default: false
  },
  ortb: {
    type: Boolean,
    default: false
  },
  ortb_id: {
    type: Number
  },
  last_modify: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: ''
    },
    date: {
      type: Date,
      default: ''
    },
    changes: {
      type: String,
      default: ''
    }
  }
}, {
  timestamps: true, 
  versionKey: false
});

domainSchema.index({ 'last_modify.date': -1 });
domainSchema.index({ 'domain': 1, });
domainSchema.index({ 'refs_to_user': 1 });

module.exports = { DomainModel: mongoose.model('Domains', domainSchema) };