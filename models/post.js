const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Post = sequelize.define('post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  petDate: {
    type: Sequelize.DATEONLY,
    field: 'pet_date'
  },
  petColor: Sequelize.STRING(30),
  gender: Sequelize.TINYINT
}, {
  timestamps: true,
  paranoid: true
});

module.exports = Post;