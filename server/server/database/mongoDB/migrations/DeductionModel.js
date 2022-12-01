const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DeductionType } = require('../../../constants/deduction-type.enum');

const deductionSchema = new Schema({

    refs_to_user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required']
    },

    deductions: [{
      _id: false,
      date: {
        type: Date
      },
      type: {
        type: String,
        default: DeductionType.OTHER
      },
      deduction: {
        type: Number
      }
    }]

  },
  {
    timestamps: true
  });

module.exports = mongoose.model('Deduction', deductionSchema);