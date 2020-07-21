const Sequelize = require('sequelize');

const sequelzie = require('../util/database');

const PostcodeArea = sequelzie.define('postcodeArea', {
  postcode: {
    type: Sequelize.STRING(6),
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  tableName: 'postcode_area'
}); 

module.exports = PostcodeArea;