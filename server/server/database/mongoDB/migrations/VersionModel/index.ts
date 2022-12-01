import { Schema, model } from 'mongoose';

const versionSchema = new Schema({
  version: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true
  },
  description: {
    in: {
      trim: true,
      type: String
    },
    out: {
      trim: true,
      type: String,
      default: null
    }
  }
});

versionSchema.index({'release_date': 1});
versionSchema.index({'version': 1});

const VersionModel = model('Version', versionSchema);

export default VersionModel;
