const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PostType = sequelize.define('postType', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING(30),
    allowNull: false
  }
});

module.exports = PostType;