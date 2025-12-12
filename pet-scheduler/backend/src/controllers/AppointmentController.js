const Appointment = require('../models/Appointment');
const Animal = require('../models/Animal');
const { Op } = require('sequelize'); // Usado para consultas complexas no Sequelize

module.exports = {

  // --- REGISTRAR NOVO AGENDAMENTO ---
  async store(req, res) {
    const user_id = req.userId;
    const { animal_id, date, description } = req.body;

    // 1. Validar a data
    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Data de agendamento inválida.' });
    }
    
    const appointmentDate = new Date(date);
    
    // 2. Verifica se o animal existe E se ele pertence ao usuário logado
    const animal = await Animal.findOne({ 
        where: { id: animal_id, user_id }
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado ou não pertence a este tutor.' });
    }
    
    // 3. (OPCIONAL) Validação de horário no passado
    if (appointmentDate < new Date()) {
      return res.status(400).json({ error: 'Não é possível agendar no passado.' });
    }

    // 4. (OPCIONAL) Verificação de Conflito de Horário
    // Vamos verificar se já existe um agendamento para o MESMO animal no mesmo horário 
    // (ou se há um conflito de horário na clínica - que exigiria mais lógica de staff)
    
    // Simplificando: vamos garantir que o mesmo animal não agende duas vezes no mesmo minuto.
    const hasConflict = await Appointment.findOne({
      where: { 
        animal_id,
        date: appointmentDate,
        status: {
          [Op.notIn]: ['canceled', 'completed'] // Ignora consultas canceladas/completadas
        }
      }
    });
    
    if (hasConflict) {
      return res.status(400).json({ error: 'Este animal já tem uma consulta agendada para este horário.' });
    }
    
    // 5. Cria o agendamento
    try {
      const appointment = await Appointment.create({
        user_id, // Tutor
        animal_id, // Pet
        date: appointmentDate,
        description,
      });

      return res.json(appointment);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar o agendamento.' });
    }
  },

  // --- LISTAR AGENDAMENTOS DO USUÁRIO LOGADO ---
  async index(req, res) {
    const user_id = req.userId;
    
    // Busca todos os agendamentos do usuário, incluindo dados do animal (pet)
    const appointments = await Appointment.findAll({
        where: { user_id },
        order: [['date', 'ASC']], // Ordena por data
        include: [
            { association: 'pet', attributes: ['name', 'species', 'breed'] }
        ]
    });
    
    return res.json(appointments);
  }
};