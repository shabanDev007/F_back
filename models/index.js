const { sequelize } = require('../config/db');
const Sequelize = require('sequelize');

const db = {};

// استيراد النماذج من Product.js
const { Product, ProductSize, ProductColor } = require('./Product');
const {Order}=require('./Order');
const {OrderItem}=require('./OrderItem');
const {Customer}=require('./Customer');


// إضافتها للكائن db
db.Product = Product;
db.ProductSize = ProductSize;
db.ProductColor = ProductColor;
db.Order = Order;
db.OrderItem = OrderItem;
db.Customer = Customer;

db.Customer.hasMany(db.Order, { foreignKey: 'customerId', as: 'orders' });
db.Order.belongsTo(db.Customer, { foreignKey: 'customerId', as: 'customer' });

// العلاقة بين Order و OrderItem
db.Order.hasMany(db.OrderItem, { foreignKey: 'orderId', as: 'items' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'orderId', as: 'order' });

// العلاقة بين Product و OrderItem (لو Product موجود)
db.Product.hasMany(db.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });


db.Product.hasMany(db.ProductSize, { foreignKey: 'productId', as: 'sizes' });
db.ProductSize.belongsTo(db.Product, { foreignKey: 'productId' });
db.Product.hasMany(db.ProductColor, { foreignKey: 'productId', as: 'colors' });
db.ProductColor.belongsTo(db.Product, { foreignKey: 'productId' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;