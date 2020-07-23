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
  firstName: {
    type: Sequelize.STRING(100),
    field: 'first_name'
  },
  
  lastName: {
    type: Sequelize.STRING(100),
    field: 'last_name'
  },
  phoneNumber: {
    type: Sequelize.STRING(100),
    field: 'phone_number'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Member;