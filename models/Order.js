const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');



// models/Order.js

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define("Order", {
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
      },
      governorate: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      shippingFee: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      promoCode: {
        type: DataTypes.STRING,
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    });
  
    return Order;
  };
  

