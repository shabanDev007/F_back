// models/mail.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mail = sequelize.define('Mail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(160),
    allowNull: false,
    validate: { isEmail: true },
  },
  subject: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT, // use TEXT so long messages don’t get cut
    allowNull: false,
  },
}, {
  tableName: 'mails',      // optional (explicit table name)
  timestamps: true,        // createdAt/updatedAt
  underscored: true,       // optional style
});

module.exports = Mail;
