const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

// Importação dos modelos (criaremos estes arquivos a seguir)
const User = require('./User');
const Animal = require('./Animal');
const Appointment = require('./Appointment');

const connection = new Sequelize(dbConfig);

// Inicializa os modelos passand a conexão
User.init(connection);
Animal.init(connection);
Appointment.init(connection);

// Define as associações (Relacionamentos 1:N, N:N)
// Um usuário (tutor) tem muitos animais
User.hasMany(Animal, { foreignKey: 'user_id', as: 'pets' });
Animal.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });

// Um animal tem muitos agendamentos
Animal.hasMany(Appointment, { foreignKey: 'animal_id', as: 'consultas' });
Appointment.belongsTo(Animal, { foreignKey: 'animal_id', as: 'pet' });

// O agendamento também pertence ao usuário
User.hasMany(Appointment, { foreignKey: 'user_id', as: 'agendamentos' });
Appointment.belongsTo(User, { foreignKey: 'user_id', as: 'tutor' });

module.exports = connection;