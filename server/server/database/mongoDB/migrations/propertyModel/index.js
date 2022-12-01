const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isUnique } = require('./validation/propertyValidation');

mongoose.Promise = global.Promise;

const propertySchema = new Schema({
  property_id: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  property_origin: {
    type: String,
    trime: true,
    required: true
  },
  placement_name: {
    type: String,
    trim: true,
    default: null
  },
  property_description: {
    type: String,
    trim: true,
    default: ''
  },
  refs_to_user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  domain: {
    type: String,
    trim: true,
    required: true
  }
}, {
  timestamps: true, 
  versionKey: false
});

propertySchema.index({ 'property_id': 1 });
propertySchema.index({ 'domain': 1 });
propertySchema.index({ 'refs_to_user': 1 });

propertySchema.statics = {
  
}

const PropertyModel = module.exports = mongoose.model('Property', propertySchema);