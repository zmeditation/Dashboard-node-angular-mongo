const { Sequelize, DataTypes } = require('sequelize');
const config = require('./config.json');
const sequelize = new Sequelize(config[process.env.NODE_ENV]);

const code = sequelize.define('Codes', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  pub_id: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  link: { type: DataTypes.STRING },
  settings: { type: DataTypes.JSON }
}, {
  freezeTableName: true,
  timestamps: true,
  initialAutoIncrement: 1
});

module.exports.codeModel = code;
