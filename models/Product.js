const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProductSize = sequelize.define('ProductSize', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price_modifier: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false,
  },
});

const ProductColor = sequelize.define('ProductColor', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hex_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price_modifier: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false,
  },
});

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isNew: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isTrending: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  has_sizes: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  has_colors: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  timestamps: true,
});


module.exports = { Product, ProductSize, ProductColor };