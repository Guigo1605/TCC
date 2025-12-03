const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agendamento = sequelize.define('Agendamento', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pendente', 'confirmado', 'cancelado', 'concluido'),
    defaultValue: 'pendente',
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  animal_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  servico_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  observacoes: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'agendamentos',
});

module.exports = Agendamento; // EXPORTAÇÃO CORRETA