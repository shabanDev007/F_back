const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');


const Discount = sequelize.define('Discount', {
  code: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  discount: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: true,
  },
});


module.exports =  Discount;