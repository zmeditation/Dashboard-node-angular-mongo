/** @format */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reports = require('../reportModel');
const { isValidEmail, isUniqueEmail } = require('./validation');

mongoose.Promise = global.Promise;

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [isValidEmail, isUniqueEmail],
    required: true
  },
  additional: {
    company: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    skype: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    birthday: Date,
    description: {
      type: String,
      trim: true
    }
  },
  password: {
    type: String,
    required: true
  },
  uuid: {
    type: String,
    required: true
  },
  commission: {
    commission_number: {
      type: Number,
      default: 0
    },
    commission_type: {
      type: String,
      default: 'eCPM'
    }
  },
  enabled: {
    changed: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: true
    }
  },
  role: {
    type: String,
    trim: true,
    uppercase: true,
    required: true
  },
  permissions: {
    type: Array,
    required: true
  },
  photo: String,
  domains: [],
  cwe: {
    type: Boolean,
    default: false
  },
  properties: [
    {
      placement_name: {
        type: String,
        trim: true
      },
      property_id: {
        type: String,
        trim: true
      },
      property_description: {
        type: String,
        trim: true
      },
      property_origin: {
        type: String,
        trim: true
      }
    }
  ],
  // user connections
  connected_users: {
    //Publisher
    p: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }
    ],
    //Account Manager
    am: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }
    ]
  },
  //Account Manager
  am: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  //Senior Account Manager
  sam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  date_to_connect_am: {
    type: Date,
    default: null
  },
  // manual upload
  previouslyUploadedReports: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reports'
      }
    ],
    maxItems: 30,
    description: 'must be an array of strings and max is 30'
  },
  generatedReport: {
    type: String,
    trim: true
  },
  wbidType: {
    type: Array,
    default: []
  },
  wbidUserId: {
    type: Number,
    default: null
  },
  oRTBType: {
    type: String,
    default: null
  },
  oRTBId: {
    type: Number,
    default: null
  },
  adWMGAdapter: {
    type: Boolean,
    default: false
  },
  is_test: {
    type: Boolean,
    default: false
  }
});

userSchema.index({ _id: 1, email: 1 }, { unique: true });

userSchema.statics = {
  async updateProperty(userId, properties, usr = null) {
    const Properties = mongoose.model('Property');
    const Domains = mongoose.model('Domains');
    if (!properties) {
      throw new Error('something went wrong with the property update of this user');
    }
    const user = usr;
    const userDomains = await Domains.find({ refs_to_user: { $in: user._id } }, { domain: true, _id: false }).distinct('domain');
    const checkForIncludeArray = Object.keys(properties).includes('include') && properties.include.length;
    const checkForExcludeArray = Object.keys(properties).includes('exclude') && properties.exclude.length;

    if (checkForIncludeArray) {
      const arrPropertyIdsInc = [];
      const arrOriginsInc = [];
      let counter = 0;

      properties.include.forEach((el) => {
        arrPropertyIdsInc.push(el.property_id);
        if (!arrOriginsInc.includes(el.property_origin)) {
          arrOriginsInc.push(el.property_origin);
        }
        const customDomain =
          el.property_description && el.property_description.match(/^custom-/) ? el.property_description.split(/^custom-/)[1] : false;
        if (customDomain) {
          Properties.create({
            property_id: el.property_id,
            property_origin: el.property_origin,
            refs_to_user: user._id,
            domain: customDomain,
            placement_name: el.placement_name
          });
        }
      });
      const AllPropertiesUser = await Properties.find({
        property_id: { $in: arrPropertyIdsInc },
        property_origin: { $in: arrOriginsInc },
        refs_to_user: null,
        domain: { $in: userDomains }
      });

      const forSave = AllPropertiesUser.map(async (el) => {
        properties.include.forEach((item) => {
          if (item.property_id === el.property_id && item.property_origin === el.property_origin) {
            el.placement_name = item.placement_name;
            el.refs_to_user = user._id;
          }
        });
        return el.placement_name !== null ? await el.save() : undefined;
      }).filter((el) => el !== undefined);

      const updateFunctionForReports = async (limit) => {
        return await Reports.find({
          'property.property_id': { $in: arrPropertyIdsInc },
          'property.domain': { $in: userDomains },
          'property.refs_to_user': null,
          report_origin: { $in: arrOriginsInc }
        })
          .limit(limit)
          .then((reps) => {
            return reps
              .map((el) => {
                properties.include.forEach((item) => {
                  if (item.property_id === el.property.property_id && item.property_origin === el.report_origin) {
                    el.property.am = user.am;
                    el.property.refs_to_user = user._id;
                    el.property.placement_name = item.placement_name;
                  }
                });
                if (el.commission.commission_number === 0 || el.commission.commission_number === null) {
                  el.commission.commission_number = user.commission.commission_number;
                  el.commission.commission_type = user.commission.commission_type;
                }
                return el.property.placement_name !== null && el.property.placement_name !== undefined && el.property.refs_to_user !== null
                  ? el.save()
                  : undefined;
              })
              .filter((item) => item !== undefined);
          });
      };

      const reportsUpdateInside = async (index, limit) => {
        console.log(index === 0 ? 'Reports updating started...' : 'Reports updating continue...');
        console.log('Current count is', index);
        // const lengthOfArray = index + limit;
        // const arrayForWork = arr.slice(index, lengthOfArray);
        const promisesArray = await updateFunctionForReports(limit);

        return Promise.all(promisesArray).then((rep) => {
          console.log(rep.length, '-', 'Reports keep updating successfully');
          index += rep.length;
          if (rep.length) {
            setTimeout(() => reportsUpdateInside(index, limit), 3000);
          } else {
            clearTimeout(setTimeout(() => reportsUpdateInside(index, limit), 3000));
            properties = properties.usersProperties ? properties.usersProperties : properties;
            console.log('All Reports updated!');
            counter = index === 0 ? 1 : index;
          }
        });
      };

      await Promise.all(forSave).then(async (r) => {
        console.log(r.length, 'properties updated');
        return new Promise((resolve, reject) => {
          reportsUpdateInside(counter, 10000).then((u) => {
            let timeoutHandler;
            const checkFunctionForCounter = () => {
              if (counter !== 0) {
                clearTimeout(timeoutHandler);
                resolve('All Reports updated!');
                return;
              }
              timeoutHandler = setTimeout(() => {
                checkFunctionForCounter();
              }, 5000);
            };
            checkFunctionForCounter();
          });
        });
      });
    }

    if (checkForExcludeArray) {
      const arrPropertyIdsExc = [];
      const arrOriginsExc = [];

      properties.exclude.forEach((el) => {
        arrPropertyIdsExc.push(el.property_id);
        if (!arrOriginsExc.includes(el.property_origin)) {
          arrOriginsExc.push(el.property_origin);
        }
      });
      await Properties.updateMany(
        {
          property_id: { $in: arrPropertyIdsExc },
          property_origin: { $in: arrOriginsExc },
          refs_to_user: user._id
        },
        {
          refs_to_user: null,
          placement_name: null
        }
      );

      await Reports.updateMany(
        {
          'property.refs_to_user': userId,
          'property.property_id': { $in: arrPropertyIdsExc },
          'property.domain': { $in: userDomains },
          'property.am': user.am,
          report_origin: { $in: arrOriginsExc }
        },
        {
          'property.refs_to_user': null,
          'property.am': null,
          'property.placement_name': null
        }
      ).then((res) => console.log(res.nModified, 'reports disconnected from user'));
    }

    return `${user.name} properties were successfully updated`;
  },
  async removePermission(permission) {
    await this.updateMany({ permissions: permission }, { $pull: { permissions: permission } });

    return 'PERMISSION_SUCCESSFULLY_REMOVED';
  }
};

//Відправляємо меседж, якщо імейл уже існує
userSchema.post('save', function (error, doc, next) {
  if (error.name === 'BulkWriteError' && error.code === 11000) next({ msg: 'This email already exists, please try another' });
  else next(error);
});

userSchema.plugin(require('mongoose-timestamp')); //Добавляет время добавления записи и время обновления записи

const User = mongoose.model('User', userSchema);
module.exports = User;
