const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Image = sequelize.define('image', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  imageUrl: {
    type: Sequelize.STRING(1024)
  }
});

module.exports = Image;