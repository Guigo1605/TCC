const Animal = require('../models/Animal');
const User = require('../models/User'); // Para garantir que o tutor exista

module.exports = {

  // --- REGISTRAR NOVO ANIMAL ---
  async store(req, res) {
    // O ID do usuário logado é extraído do token JWT pelo middleware
    const user_id = req.userId; 
    
    // Dados do novo animal
    const { name, species, breed, birth_date } = req.body;

    // 1. Verifica se o usuário (tutor) realmente existe
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ error: 'Tutor não encontrado.' });
    }

    // 2. Cria o novo animal e o associa ao usuário
    try {
      const animal = await Animal.create({
        user_id, // Associa o animal ao ID do usuário logado
        name,
        species,
        breed,
        birth_date,
      });

      return res.json(animal);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Erro ao registrar o animal.' });
    }
  },

  // --- LISTAR ANIMAIS DO USUÁRIO LOGADO ---
  async index(req, res) {
    const user_id = req.userId;

    // 1. Busca o usuário com seus animais (pets)
    // O 'as: pets' é definido na associação em models/index.js
    const user = await User.findByPk(user_id, {
      include: { association: 'pets' },
    });

    if (!user) {
      return res.status(404).json({ error: 'Tutor não encontrado.' });
    }

    // 2. Retorna a lista de animais
    return res.json(user.pets);
  },
};