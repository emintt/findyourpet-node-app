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
    type: Sequelize.DATE,
    field: 'pet_date',
    //defaultValue: sequelize.fn('DATE_FORMAT', sequelize.col('post.pet_date'), '%d/%m/%Y')
    // get() {
    //   let rawValue = this.getDataValue('petDate');
    //   return rawValue.getFullYear();
    // }
  }
  // ,
  // createdAt: {
  //   type: Sequelize.DATE,
  //   allowNull: false,
  //   defaultValue: Sequelize.NOW,
  //   field: 'created_at',
  //   get() {
  //     let rawValue = this.getDataValue(createdAt);
  //     return rawValue;
  //   }
  // }
}, {
  timestamps: true,
  // createdAt: 'created_at', 
  // updatedAt: 'updated_at'
});

module.exports = Post;