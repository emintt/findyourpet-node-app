const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PetType = sequelize.define('petType', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false
  }
});

module.exports = PetType;