const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs'); // Importa a biblioteca de criptografia

class User extends Model {
  static init(sequelize) {
    super.init({
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: DataTypes.STRING, // Onde a senha Criptografada é salva
      password: DataTypes.VIRTUAL // Campo virtual para receber a senha no request (NÃO SALVA NO DB)
    }, {
      sequelize,
      tableName: 'users',
      hooks: {
        // --- HOOK DE CRIPTOGRAFIA (Executado antes de salvar) ---
        beforeSave: async (user) => {
          // Verifica se o campo 'password' foi fornecido no objeto
          if (user.password) {
            // Criptografa a senha e armazena no campo password_hash
            user.password_hash = await bcrypt.hash(user.password, 8);
          }
        },
      },
    });
  }

  // --- MÉTODO DE COMPARAÇÃO DE SENHA ---
  checkPassword(password) {
    // Compara a senha em texto puro fornecida (password) com o hash (this.password_hash)
    return bcrypt.compare(password, this.password_hash); 
  }

  static associate(models) {
    // Associações
  }
}

module.exports = User;