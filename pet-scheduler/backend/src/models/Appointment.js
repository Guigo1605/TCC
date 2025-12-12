const { Model, DataTypes } = require('sequelize');

class Appointment extends Model {
  static init(sequelize) {
    super.init({
      // Data e hora da consulta
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: DataTypes.TEXT, // Motivo da consulta
      
      // status pode ser 'scheduled', 'completed', 'canceled'
      status: {
        type: DataTypes.STRING,
        defaultValue: 'scheduled',
      },
      
      // user_id e animal_id serão chaves estrangeiras
    }, {
      sequelize,
      tableName: 'appointments',
    });
  }

  // Define as associações (usado implicitamente pelo models/index.js)
  static associate(models) {
    // Um agendamento pertence a um animal
    this.belongsTo(models.Animal, { foreignKey: 'animal_id', as: 'pet' });
    
    // Um agendamento também pertence ao tutor (User)
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'tutor' });
  }
}

module.exports = Appointment;