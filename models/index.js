const { sequelize } = require('../config/db');
const Sequelize = require('sequelize');

const db = {};

// استيراد الموديلات وتعريفهم
db.Order = require('./Order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize.DataTypes);

// العلاقات بين الجداول
db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', as: 'items' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId' });

// تصدير الاتصال والموديلات
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
