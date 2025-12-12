const { Model, DataTypes } = require('sequelize');

class Animal extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      species: DataTypes.STRING, // Espécie (ex: Cachorro, Gato, Pássaro)
      breed: DataTypes.STRING,   // Raça
      birth_date: DataTypes.DATEONLY, // Data de Nascimento
      
      // Chave estrangeira para o User (Tutor). O valor é preenchido automaticamente pelo Sequelize.
      // user_id: DataTypes.INTEGER, 
    }, {
      sequelize,
      tableName: 'animals',
    });
  }

  // Define as associações (usado implicitamente pelo models/index.js)
  static associate(models) {
    // Um animal pertence a um único usuário (tutor)
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
  }
}

module.exports = Animal;