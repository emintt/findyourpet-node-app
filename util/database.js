const {Sequelize} = require('sequelize');
const {dbConfig} = require('../config');

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  dialect: dbConfig.dialect,
  host: dbConfig.host,
  define: {
    freezeTableName: true,
    timestamps: false,
    underscored: true
  }
});


module.exports = sequelize;


