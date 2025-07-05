
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// models/OrderItem.js

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define("OrderItem", {
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      itemPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      selectedSize: {
        type: DataTypes.STRING,
      },
      selectedColor: {
        type: DataTypes.STRING,
      },
    });
  
    return OrderItem;
  };
  