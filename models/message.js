const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Message = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Message;