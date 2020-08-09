const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Post = sequelize.define('post', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'title'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    field: 'content'
  },
  petDate: {
    type: Sequelize.DATEONLY,
    field: 'pet_date'
  }
}, {
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at', 
  updatedAt: 'updated_at'
});

module.exports = Post;