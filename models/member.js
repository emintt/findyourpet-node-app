const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Member = sequelize.define('member', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING(350),
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  firstName: Sequelize.STRING(100),
  lastName: Sequelize.STRING(100),
  phoneNumber: Sequelize.STRING(15)
}, {
  timestamps: true
});

module.exports = Member;