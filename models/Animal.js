const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Animal = sequelize.define('Animal', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  especie: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  raca: {
    type: DataTypes.STRING(50),
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'animais',
});

module.exports = Animal; // EXPORTAÇÃO CORRETA