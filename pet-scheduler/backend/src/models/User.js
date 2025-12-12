const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // A senha será armazenada como hash
      password_hash: DataTypes.STRING, 
    }, {
      sequelize,
      tableName: 'users',
      // Hooks (Ganchos) do Sequelize
      hooks: {
        // Antes de criar ou atualizar, criptografa a senha
        beforeSave: async (user) => {
          if (user.password) {
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        },
      },
    });
  }

  // Método para verificar se a senha fornecida corresponde ao hash
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }

  static associate(models) {
    // Associações definidas no models/index.js, mas mantemos o static associate por padrão
    // User.hasMany(models.Animal, { foreignKey: 'user_id', as: 'pets' });
  }
}

module.exports = User;