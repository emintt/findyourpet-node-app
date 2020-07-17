const Sequelize = require('sequelize');

const sequelzie = require('../util/database');

const Region = sequelzie.define('region', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Region;