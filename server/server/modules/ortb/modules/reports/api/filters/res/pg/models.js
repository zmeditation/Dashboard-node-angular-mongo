const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json');
const sequelize = new Sequelize(config[process.env.NODE_ENV]);

const SSP = sequelize.define('ssp', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  secret_key: { type: DataTypes.STRING, defaultValue: '' },
  enable: { type: DataTypes.BOOLEAN, defaultValue: true },
  qps_limit: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  freezeTableName: true,
  timestamps: false,
  initialAutoIncrement: 1000
});

const DSP = sequelize.define('dsp', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      len: [3, 50]
    }
  },
  // endpoint: { type: DataTypes.STRING, defaultValue: '' },
  // enable: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  freezeTableName: true,
  timestamps: false,
  initialAutoIncrement: 100
});

const SSP_Domain = sequelize.define('ssp_domain', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ssp_id: { type: DataTypes.INTEGER },
  domain: { type: DataTypes.STRING, unique: true },
  enable: { type: DataTypes.BOOLEAN, defaultValue: true },
  qps_limit: { type: DataTypes.INTEGER }
}, {
  freezeTableName: true,
  timestamps: false
});

const DSP_SSP_Connections = sequelize.define('dsp_ssp', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  dsp_id: { type: DataTypes.INTEGER },
  ssp_id: { type: DataTypes.INTEGER }
}, {
  freezeTableName: true,
  timestamps: false
})

SSP.hasMany(SSP_Domain);
SSP_Domain.belongsTo(SSP, { foreignKey: 'ssp_id', targetKey: 'id' });

module.exports.SSP = SSP;
module.exports.SSP_Domain = SSP_Domain;
module.exports.DSP = DSP;
module.exports.DSP_SSP_Connections = DSP_SSP_Connections;
