const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const PetGender = sequelize.define('petGender', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'pet_gender'
});

module.exports = PetGender;