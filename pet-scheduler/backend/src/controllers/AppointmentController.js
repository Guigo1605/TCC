const { Op } = require('sequelize');
const Animal = require('../models/Animal'); // Corrigido para Animal (não Pet)
const Appointment = require('../models/Appointment');

module.exports = {

  // --- 1. CRIAR AGENDAMENTO (POST /appointments) ---
  async store(req, res) {
    const user_id = req.userId;
    const { animal_id, date, description } = req.body;

    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({ error: 'Data de agendamento inválida.' });
    }
    
    const appointmentDate = new Date(date);
    
    // 1. Verifica se o animal existe e pertence ao usuário
    const animal = await Animal.findOne({ 
        where: { id: animal_id, user_id }
    });

    if (!animal) {
      return res.status(404).json({ error: 'Animal não encontrado ou não pertence a este tutor.' });
    }
    
    // 2. Verifica se a data é no futuro
    if (appointmentDate < new Date()) {
      return res.status(400).json({ error: 'Não é possível agendar no passado.' });
    }

    // 3. Verifica conflito de horário para o mesmo animal (Regra de Negócio)
    const hasConflict = await Appointment.findOne({
      where: { 
        animal_id,
        date: appointmentDate,
        status: {
          [Op.notIn]: ['canceled', 'completed']
        }
      }
    });
    
    if (hasConflict) {
      return res.status(400).json({ error: 'Este animal já tem uma consulta agendada para este horário.' });
    }
    
    try {
      const appointment = await Appointment.create({
        user_id,
        animal_id,
        date: appointmentDate,
        description,
      });

      return res.json(appointment);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao criar o agendamento.' });
    }
  },

  // --- 2. LISTAR AGENDAMENTOS (GET /appointments) ---
  async index(req, res) {
    const user_id = req.userId;
    
    const appointments = await Appointment.findAll({
        where: { user_id },
        order: [['date', 'ASC']],
        include: [
            { association: 'pet', attributes: ['name', 'species', 'breed'] }
        ]
    });
    
    return res.json(appointments);
  },
  
  // --- 3. ATUALIZAR AGENDAMENTO (PUT /appointments/:appointment_id) ---
  async update(req, res) {
    const { appointment_id } = req.params;
    const { date, description, status } = req.body;
    const user_id = req.userId;

    try {
      const appointment = await Appointment.findByPk(appointment_id, {
        // Inclui o pet para verificar a propriedade do usuário
        include: [{ model: Animal, as: 'pet', attributes: ['user_id'] }] 
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      // Verifica se o agendamento pertence ao usuário logado
      if (appointment.pet.user_id !== user_id) {
        return res.status(401).json({ error: 'Operação não autorizada.' });
      }
      
      // Validação de data, se estiver sendo alterada
      if (date && new Date(date) < new Date()) {
          return res.status(400).json({ error: 'Não é possível agendar no passado.' });
      }

      // Atualiza os dados
      await appointment.update({
        date: date ? new Date(date) : appointment.date, // Só atualiza se fornecido
        description,
        status,
      });

      // Retorna o agendamento atualizado com os dados do pet
      const result = await Appointment.findByPk(appointment.id, {
        include: [{ association: 'pet' }]
      });

      return res.json(result);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao atualizar agendamento.' });
    }
  },

  // --- 4. EXCLUIR AGENDAMENTO (DELETE /appointments/:appointment_id) ---
  async delete(req, res) {
    const { appointment_id } = req.params;
    const user_id = req.userId;

    try {
      const appointment = await Appointment.findByPk(appointment_id, {
        // Inclui o pet para verificar a propriedade do usuário
        include: [{ model: Animal, as: 'pet', attributes: ['user_id'] }]
      });

      if (!appointment) {
        return res.status(404).json({ error: 'Agendamento não encontrado.' });
      }

      // Verifica se o agendamento pertence ao usuário logado
      if (appointment.pet.user_id !== user_id) {
        return res.status(401).json({ error: 'Operação não autorizada.' });
      }

      // Regra de Negócio: Impede exclusão de agendamentos passados
      const now = new Date();
      if (new Date(appointment.date) < now) {
        return res.status(400).json({ error: 'Não é possível excluir agendamentos passados.' });
      }

      await appointment.destroy();

      return res.status(204).send(); // Sucesso sem conteúdo
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao excluir agendamento.' });
    }
  },
};