const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const City = sequelize.define('city', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
    unique: true
  }
});

module.exports = City;