const Usuario = require('../models/Usuario');
const Animal = require('../models/Animal');
const Servico = require('../models/Servico');
const Agendamento = require('../models/Agendamento');

const defineAssociations = () => {
    // Relação 1:N: Um Usuário tem muitos Animais (pets)
    Usuario.hasMany(Animal, {
        foreignKey: 'usuario_id',
        as: 'pets'
    });
    Animal.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        as: 'dono'
    });

    // Relação 1:N: Usuário -> Agendamentos
    Usuario.hasMany(Agendamento, {
        foreignKey: 'usuario_id',
        as: 'agendamentosCliente'
    });
    Agendamento.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        as: 'cliente'
    });

    // Relação 1:N: Animal -> Agendamentos
    Animal.hasMany(Agendamento, {
        foreignKey: 'animal_id',
        as: 'agendamentos'
    });
    Agendamento.belongsTo(Animal, {
        foreignKey: 'animal_id',
        as: 'pet'
    });

    // Relação 1:N: Servico -> Agendamentos
    Servico.hasMany(Agendamento, {
        foreignKey: 'servico_id',
        as: 'agendamentos'
    });
    Agendamento.belongsTo(Servico, {
        foreignKey: 'servico_id',
        as: 'servicoContratado'
    });
};

module.exports = defineAssociations;