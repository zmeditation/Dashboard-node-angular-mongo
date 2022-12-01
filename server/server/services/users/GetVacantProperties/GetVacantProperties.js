const Base = require('./../../Base');
const { ServerError } = require('../../../handlers/errorHandlers');
const mongoose = require("mongoose");
const Domains = mongoose.model("Domains");
const Properties = mongoose.model('Property');
const UserModel = mongoose.model("User");

class GetVacantProperties extends Base {
  constructor(args) {
    super(args);
  }

  async execute({ body: { additional: { permission, id: userTokenId } }, paramsId }) {
    if (permission) {
      let properties = undefined;
      switch (permission) {
        case "canReadAllUsers":
          properties = await this.getVacantProperties(paramsId);
          break;
        case "canReadAllPubs":
          properties = await this.getVacantProperties(paramsId);
          properties = properties.filter(property => property._id !== 'Google Ad Manager HB');
          break;
        case "canReadOwnPubs":
          properties = await this.getVacantProperties(paramsId, userTokenId);
          properties = properties.filter(property => property._id !== 'Google Ad Manager HB');
          break;
        default:
          throw new ServerError('USER_NOT_FOUND', 'BAD_REQUEST');
      }

      if (!properties.length) {
        return { success: true, result: [] }
      }

      return {
        success: true,
        result: properties
      }
    } else {
      throw new ServerError('USER_NOT_FOUND', 'BAD_REQUEST');
    }
  }

  async getVacantProperties(paramsId, userTokenId) {
    const query = { refs_to_user: { $in: paramsId } };
    const usersDomains = await Domains.find(query, { domain: true, _id: false }).distinct('domain');

    await this.mainFuncToUpdate(paramsId, usersDomains).then(res => {
      let modifiedCount = 0
      let totalArr = [];
      if (res?.length) {
        res.forEach(el => {
          totalArr = totalArr.concat(el);
        });
      }
      totalArr.forEach(el => {
        modifiedCount += el.nModified;
      })
      console.log(modifiedCount, 'vacant duplicated properties repaired');
    });

    if (!usersDomains.length) {
      return [];
    }

    return Properties.aggregate([
      {
        $match: {
          'domain': { $in: usersDomains },
          $or: [
            { 'refs_to_user': { $exists: false } },
            { 'refs_to_user': null }
          ]
        }
      },
      {
        $group: {
          _id: '$property_origin',
          properties: { $addToSet: '$property_id' }
        }
      }
    ]);
  }

  async mainFuncToUpdate(paramsId, usersDomains) {
    const user = await UserModel.findOne({ _id: paramsId });

    if (!user.properties.length) {
      return;
    }

    const origins = Array.from(new Set(user.properties.map(prop => {
      return prop.property_origin;
    })));

    const propsByPlcmnt = {};
    user.properties.forEach(prop => {
      if (!Object.keys(propsByPlcmnt).includes(prop.placement_name)) {
        propsByPlcmnt[prop.placement_name] = [];
      }
      if (!propsByPlcmnt[prop.placement_name].includes(prop.property_id)) {
        propsByPlcmnt[prop.placement_name].push(prop.property_id);
      }
    });

    const updateProperties = async (origin, properties) => {
      const propsForUpdate = Object.keys(properties).map(plcmnt => {
        return Properties.updateMany({
          refs_to_user: null,
          property_origin: origin,
          domain: { $in: usersDomains },
          property_id: { $in: properties[plcmnt] }
        }, {
          placement_name: plcmnt,
          refs_to_user: paramsId
        });
      })
      return await Promise.all(propsForUpdate);
    }

    const promises = origins.map((orig) => {
      return updateProperties(orig, propsByPlcmnt);
    });
    return Promise.all(promises);
  }
}

module.exports = GetVacantProperties;
