const Sequelize = require('sequelize');
const moment = require('moment');

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
    allowNull: false,
    field: 'pet_date',
    validate: {
      isDate: {
        args: true,
        msg: 'Pitää olla kelvollinen päiväänmäärä muodossa esim. 12/06/2020'
      } 
    },
    get() {
      const rawValue = this.getDataValue('petDate');
      return moment(rawValue).format('DD/MM/YYYY');
    }
  }
}, {
  timestamps: true,
  // createdAt: 'created_at', 
  // updatedAt: 'updated_at'
});

module.exports = Post;