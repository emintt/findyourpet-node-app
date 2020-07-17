const Sequelize = require('sequelize');

const sequelzie = require('../util/database');

const PostcodeArea = sequelzie.define('postcodeArea', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
  },
  postcode: {
    type: Sequelize.STRING(6),
    allowNull: false,
  }
});

module.exports = PostcodeArea;